# Programmatic alwaysdata API deployments

Use the existing free development preview: account `ismi`, site `1076252`,
`/home/ismi/ismi/app` and separate `/home/ismi/ismi/data`. This workflow needs no
new provider, plan, database or recurring job. Frontend pushes still deploy through
Vercel; this command deploys only API application files and never publishes curriculum.

## One-time owner setup

1. Configure a reusable, dedicated SSH key on the existing Ismi SSH user. Keep its
   private key outside Git (prefer a passphrase-protected key loaded in your SSH agent).
   Verify the server fingerprint against Remote access → SSH/SFTP before trusting it.
   The script uses strict host-key verification; it will not auto-accept a host key.
2. Create an alwaysdata access token in Profile after enabling 2FA. A token inherits
   the profile's permissions; it is not intrinsically a site-only restart token.
   Use a dedicated limited profile where available and an IP restriction where useful.
   Creation of durable hosting credentials requires the owner's explicit approval.
3. Copy `deploy/alwaysdata.example.json` to `deploy/alwaysdata.local.json`, enter the
   SSH private-key path and token in that ignored file, and run
   `chmod 600 deploy/alwaysdata.local.json`. Keep credentials out of chat and commits.
   The file is read only by the deployment script, not the web/API application.
4. Run `npm run deploy:api -- --check` to verify the existing site and SSH access.

For later **owner-authorized** releases:

```sh
npm run deploy:api
```

Install/restore repository dependencies and run applicable tests beforehand. The
command requires clean tracked/staged files, publishes the current checkout in Release
mode, strips development overrides/symbols, verifies site path/address, verifies SQLite
integrity, hashes the uploaded archive, and rejects archive traversal/symlinks. It keeps
application rollback and an online SQLite backup in an owner-only timestamped directory,
then swaps application directories, calls the site's API restart and verifies health,
assembly, recordings and cookie keys. Credentials never appear in command arguments or
logs. Existing data files are never uploaded/replaced. An unhealthy/failed verification
restores the prior application and restarts; it does not overwrite live data or undo
additive schemas. Inspect backups before attempting a data/schema rollback.

Local preparation without credentials or external changes:

```sh
npm run deploy:api -- --prepare
python3 -m unittest discover -s deploy -p 'test_*.py'
```

Local fixture tests pass; a real authenticated `--check` and deployment remain required
before claiming the workflow is proven on alwaysdata. Backups consume the existing
1 GB allowance; keep useful release backups and remove obsolete ones deliberately.
Physical free-space checks do not establish the account's provider quota. Brief
restart downtime is possible. This is a manual terminal workflow; GitHub Actions
integration can be added if separately requested.

Official references verified October 12, 2026:
[SSH](https://help.alwaysdata.com/en/docs/web-hosting/remote-access/ssh/),
[API restart](https://help.alwaysdata.com/en/docs/development/api/),
[token permissions/2FA](https://help.alwaysdata.com/en/docs/admin-billing/profile/tokens/),
[restart behavior](https://help.alwaysdata.com/en/docs/web-hosting/sites/restart-a-site/).
