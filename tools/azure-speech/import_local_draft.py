"""Import only into the isolated F19 localhost fixture API; never approve/publish."""
import http.cookiejar
import json
import urllib.error
import urllib.request

from prepare_draft import prepare, SELECTED, OUTPUT

BASE='http://localhost:5064'
EMAIL='f19-preview@example.test'
# Deliberately public local-fixture credential. Never reuse for an actual account.
PASSWORD='local-f19-fixture-only-password'


def main():
    package=json.loads(prepare().read_text())
    client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    def request(path, payload=None, raw=None):
        headers={}
        body=None
        if payload is not None or raw is not None:
            token=json.loads(client.open(BASE+'/api/auth/csrf').read())['token']
            headers['X-CSRF-TOKEN']=token
            headers['Content-Type']='application/json' if raw is None else 'audio/wav'
            body=json.dumps(payload).encode() if raw is None else raw
        with client.open(urllib.request.Request(BASE+path,data=body,headers=headers),timeout=30) as response:
            return json.loads(response.read())
    try:
        request('/api/auth/register',dict(displayName='F19 local preview',email=EMAIL,password=PASSWORD))
    except urllib.error.HTTPError as error:
        if error.code!=400:raise
        request('/api/auth/login',dict(email=EMAIL,password=PASSWORD,rememberMe=False))
    before=request('/api/admin/curriculum/versions')
    published_before=sorted((r['lessonId'],r['id']) for r in before if r['status']=='published')
    for asset in sorted(SELECTED.glob('*.wav')):
        uploaded=request('/api/admin/curriculum/recordings',raw=asset.read_bytes())
        if uploaded['audioUrl']!=f'/api/recordings/{asset.name}':
            raise ValueError('Uploaded asset hash mismatch')
    matches=[r for r in before if r['lessonId']==package['lesson']['id'] and r['status']=='draft']
    if matches:
        saved=request(f'/api/admin/curriculum/versions/{max(matches,key=lambda r:r["id"])["id"]}')
        incoming=dict(package['lesson'],version=saved['lesson']['version'])
        # Compare relevant source payload after server normalization; never overwrite.
        def normalized(value):
            if isinstance(value,dict):return {k:normalized(v) for k,v in value.items() if v is not None}
            if isinstance(value,list):return [normalized(v) for v in value]
            return value
        if normalized(saved['lesson']['steps'])!=normalized(incoming['steps']):
            raise ValueError('Existing draft differs; preserved')
    else:saved=request('/api/admin/curriculum/drafts',package)
    readiness=request(f'/api/admin/curriculum/versions/{saved["id"]}/readiness',{})
    if not readiness['draft']['isValid']:
        raise ValueError('Draft structure failed: '+'; '.join(readiness['draft']['errors']))
    if readiness['publication']['isValid']:
        raise ValueError('Pending-rights package unexpectedly publication-ready')
    after=request('/api/admin/curriculum/versions')
    if published_before!=sorted((r['lessonId'],r['id']) for r in after if r['status']=='published'):
        raise ValueError('Published lesson set changed')
    summary=dict(database='isolated tools/azure-speech/.cache/f19-preview.db',recordId=saved['id'],
                 version=saved['versionNumber'],status=saved['status'],lessonId=saved['lesson']['id'],
                 readiness=readiness,publishedSetPreserved=True,selectedPromptMappings=len(saved['lesson']['steps']),
                 application='local working tree only; not deployed',publication='none')
    (OUTPUT/'local-import-evidence.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(summary,ensure_ascii=False))


if __name__=='__main__':
    main()
