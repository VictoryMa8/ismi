using Ismi.Api.Services;

namespace Ismi.Api.Tests;

public sealed class RecordingTests
{
    // A short silent signal, used only to exercise storage/transport, never as lesson audio.
    public static byte[] Wave()
    {
        using var stream = new MemoryStream();
        using var writer = new BinaryWriter(stream);
        writer.Write("RIFF"u8); writer.Write(36 + 1600); writer.Write("WAVEfmt "u8);
        writer.Write(16); writer.Write((short)1); writer.Write((short)1);
        writer.Write(8000); writer.Write(16000); writer.Write((short)2); writer.Write((short)16);
        writer.Write("data"u8); writer.Write(1600); writer.Write(new byte[1600]);
        return stream.ToArray();
    }

    [Fact]
    public void RejectsTruncatedMalformedAndOversizedWaveFiles()
    {
        RecordingStore.ValidateWave(Wave());
        Assert.Throws<InvalidDataException>(() => RecordingStore.ValidateWave(Wave()[..^1]));
        var badFormat = Wave(); badFormat[20] = 3;
        Assert.Throws<InvalidDataException>(() => RecordingStore.ValidateWave(badFormat));
        var badChunk = Wave(); badChunk[40] = 255; badChunk[43] = 255;
        Assert.Throws<InvalidDataException>(() => RecordingStore.ValidateWave(badChunk));
        Assert.Throws<InvalidDataException>(() => RecordingStore.ValidateWave(new byte[RecordingStore.MaxBytes + 1]));
    }

    [Theory]
    [InlineData("https://example.test/recording.wav")]
    [InlineData("/api/recordings/../../appsettings.json")]
    [InlineData("/api/recordings/short.wav")]
    public void RejectsUnmanagedRecordingUrls(string url) => Assert.False(RecordingStore.IsUrl(url));
}
