using System.Buffers.Binary;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace Ismi.Api.Services;

// Content-addressed files keep published and downloaded lesson versions immutable.
public sealed class RecordingStore(IConfiguration configuration, IWebHostEnvironment environment)
{
    public const int MaxBytes = 10 * 1024 * 1024;
    private string Root => Path.GetFullPath(
        configuration["Recordings:Path"] ?? "App_Data/recordings", environment.ContentRootPath);

    public static bool IsUrl(string? url) => url is not null &&
        Regex.IsMatch(url, @"\A/api/recordings/[a-f0-9]{64}\.wav\z");

    public string? Find(string? url) => IsUrl(url) && File.Exists(Path.Combine(Root, url![16..]))
        ? Path.Combine(Root, url![16..]) : null;

    public async Task<string> SaveAsync(byte[] bytes, CancellationToken cancellationToken)
    {
        ValidateWave(bytes);
        var name = Convert.ToHexStringLower(SHA256.HashData(bytes)) + ".wav";
        Directory.CreateDirectory(Root);
        var temporary = Path.Combine(Root, Guid.NewGuid().ToString("N") + ".tmp");
        try
        {
            await File.WriteAllBytesAsync(temporary, bytes, cancellationToken);
            try { File.Move(temporary, Path.Combine(Root, name), overwrite: false); }
            catch (IOException) when (File.Exists(Path.Combine(Root, name))) { }
        }
        finally { if (File.Exists(temporary)) File.Delete(temporary); }
        return "/api/recordings/" + name;
    }

    public static void ValidateWave(byte[] bytes)
    {
        static uint U32(byte[] b, int i) => BinaryPrimitives.ReadUInt32LittleEndian(b.AsSpan(i, 4));
        static ushort U16(byte[] b, int i) => BinaryPrimitives.ReadUInt16LittleEndian(b.AsSpan(i, 2));
        static bool Tag(byte[] b, int i, string tag) => b.AsSpan(i, 4).SequenceEqual(System.Text.Encoding.ASCII.GetBytes(tag));
        void Invalid() => throw new InvalidDataException("Upload a valid 16-bit PCM WAV recording (mono or stereo, 8–48 kHz, up to 10 MB).");
        if (bytes.Length is < 44 or > MaxBytes) Invalid();
        if (!Tag(bytes, 0, "RIFF") || !Tag(bytes, 8, "WAVE") || U32(bytes, 4) != bytes.Length - 8) Invalid();
        var format = false;
        var dataLength = 0;
        var blockAlign = 0;
        var offset = 12;
        while (offset + 8 <= bytes.Length)
        {
            var size = U32(bytes, offset + 4);
            if (size > bytes.Length - offset - 8) Invalid();
            var start = offset + 8;
            if (Tag(bytes, offset, "fmt "))
            {
                if (format || size < 16) Invalid();
                var channels = U16(bytes, start + 2);
                var rate = U32(bytes, start + 4);
                blockAlign = U16(bytes, start + 12);
                if (U16(bytes, start) != 1 || channels is < 1 or > 2 || rate is < 8000 or > 48000 ||
                    U16(bytes, start + 14) != 16 || blockAlign != channels * 2 || U32(bytes, start + 8) != rate * blockAlign) Invalid();
                format = true;
            }
            if (Tag(bytes, offset, "data"))
            {
                if (dataLength != 0 || size == 0) Invalid();
                dataLength = (int)size;
            }
            offset = start + (int)size + (int)(size % 2);
        }
        if (offset != bytes.Length || !format || dataLength == 0 || dataLength % blockAlign != 0) Invalid();
    }
}
