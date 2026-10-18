using System.Text.Json;
using System.Security.Cryptography;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Ismi.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
var stage = Path.GetFullPath(args[0]);
var root = "/home/ismi/ismi/data";
if (!stage.StartsWith("/home/ismi/ismi/deployments/20261018-f19-s0")) throw new Exception("Wrong target");
var bytes = File.ReadAllBytes(Path.Combine(stage,"01-lesson.json"));
if (Convert.ToHexStringLower(SHA256.HashData(bytes)) != args[1]) throw new Exception("Package changed");
var json = new JsonSerializerOptions(JsonSerializerDefaults.Web);
var package = JsonSerializer.Deserialize<CurriculumDraftRequest>(bytes,json)!;
if (package.Lesson.Id != "levantine-everyday-01-01" || package.Lesson.Steps.Count != 8) throw new Exception("Wrong lesson");
var builder = WebApplication.CreateBuilder(Array.Empty<string>());
builder.Logging.ClearProviders();
builder.Configuration.AddInMemoryCollection(new Dictionary<string,string?>{{"Recordings:Path",root+"/recordings"}});
await using var db = new IsmiDbContext(new DbContextOptionsBuilder<IsmiDbContext>().UseSqlite("Data Source="+root+"/ismi.db").Options);
var recordings = new RecordingStore(builder.Configuration,builder.Environment);
var policy = new KhmerTextPreviewPolicy(builder.Configuration);
var validator = new CurriculumValidator(recordings,policy);
var service = new CurriculumPublishingService(db,validator,policy);
if (await db.CurriculumVersions.AnyAsync(v=>v.LessonId==package.Lesson.Id && v.Status=="draft")) throw new Exception("Existing draft preserved");
foreach(var step in package.Lesson.Steps) {
 var hash=step.Prompt.Recording!.Synthesis!.AudioSha256;
 var data=File.ReadAllBytes(Path.Combine(stage,hash+".wav"));
 if(Convert.ToHexStringLower(SHA256.HashData(data))!=hash) throw new Exception("Audio hash changed");
 RecordingStore.ValidateWave(data);
}
if(args[2] != "publish") { Console.WriteLine("Package and six WAV hashes passed; no database changes."); return; }
foreach(var step in package.Lesson.Steps) {
 var hash=step.Prompt.Recording!.Synthesis!.AudioSha256;
 if(await recordings.SaveAsync(File.ReadAllBytes(Path.Combine(stage,hash+".wav")),default) != step.Prompt.AudioUrl) throw new Exception("Upload mismatch");
}
var valid = validator.Validate(package.Lesson,package.Sources);
if(!valid.IsValid) throw new Exception(string.Join("; ",valid.Errors));
const string actor="Owner-authorized F19 S0 release via Codex; October 18, 2026";
var draft = await service.CreateDraftAsync(package,actor);
var readiness = await service.ReadinessAsync(draft.Id,actor);
if(!readiness.Publication.IsValid) throw new Exception("Readiness failed");
var saved = await service.GetAsync(draft.Id);
if(saved is null || saved.Lesson.Steps.Count != 8) throw new Exception("Saved readback failed");
await service.ValidateAsync(draft.Id,actor);
await service.ApproveAsync(draft.Id,actor);
var published=await service.PublishAsync(draft.Id,actor);
var evidence=JsonSerializer.Serialize(published,json);
File.WriteAllText(Path.Combine(stage,"publication.json"),evidence);
Console.WriteLine(JsonSerializer.Serialize(new {published.Id,published.VersionNumber,published.Status},json));
