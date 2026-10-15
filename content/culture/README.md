# Arabic cultural media — F21

October 15, 2026. These are **research drafts, not approved recommendations**.
Four editions contain 12 named candidates; `replacement-candidates.json` contains
one additional video, film and song. No media, lyric, image or transcript is copied.

| Proposed edition | YouTube | Film | Song |
| --- | --- | --- | --- |
| October 12 | [Favourite place in Cairo](https://www.youtube.com/watch?v=QP4RqBBq3II), Easy Arabic | [Wajib](https://trigon-film.org/en/films/wajib/), Annemarie Jacir | [Intro to Shamstep](https://47soul.bandcamp.com/track/intro-to-shamstep), 47SOUL |
| October 19 | [Before coming to Palestine](https://www.youtube.com/watch?v=efQtUGC2kpQ), Easy Languages | [Theeb](https://2026.filmmovement.com/press/film/theeb), Naji Abu Nowar | [Holm](https://emel.bandcamp.com/track/holm), Emel |
| October 26 | [Common Tunisian words](https://www.youtube.com/watch?v=37H-82LrXmk), Easy Arabic | [Wadjda](https://www.sonypictures.com/movies/wadjda), Haifaa Al Mansour | [Hal](https://www.yasminehamdan.com/music/yn-2013/cmmssvndy000l3qtplry7el9c), Yasmine Hamdan |
| November 2 | [Weekend plans](https://www.youtube.com/watch?v=8EciZuypbS4), Easy Languages | [Where Do We Go Now?](https://www.sonyclassics.com/wheredowegonow/), Nadine Labaki | [Meeli](https://47soul.bandcamp.com/track/meeli), 47SOUL |

The dates are proposed edition IDs, not claims of historical publication. An
edition can be published during its week after approval; future editions stay
private until Monday 00:00 UTC. The first four dates may need a deliberate update
before importing into a later checkout; an existing edition's week is immutable.

## Evidence and exact remaining checks

Primary publisher/artist pages and public publisher-indexed metadata were inspected
October 15. They establish candidate identity/source links and some runtime/year
metadata, not actual playback, unrestricted access, subtitle accuracy or human
linguistic review. Some YouTube direct opens returned fetch errors; indexed
publisher descriptions are recorded as discovery evidence only. Do not turn those
errors into claims that videos have been removed or that playback succeeds.

- Runtime `0` means unknown and fails publication validation. Access `unknown`
  means unverified and also fails validation. The private preview labels these
  Runtime pending and Access pending. They cannot enter the public catalog.
- `checkedAtUtc` in these files records **metadata retrieval only**, as their
  evidence says. Replace it with a real availability check and verify region,
  cost, sign-in and support before approval; checks older than seven days fail.
- Wajib has conflicting edition metadata: the distributor lists 2017 / 96 minutes,
  while the linked Prime listing shows 2018 / 93 minutes. Confirm the exact offered
  edition and its runtime. The public Prime listing advertises a rental and English
  closed captions; no rental or region-specific playback was tested or purchased.
- Theeb and the Sony film primary links currently lead to publisher viewing
  information. Replace with verified full-film viewing destinations or accurately
  label the route in access notes. Theeb's official trailer ID comes from the
  distributor's embed; Wadjda's trailer comes from Sony's verified channel.
- Wajib's proposed free companion is the trailer listed on its Prime page.
  Confirm that the trailer is actually free and accessible without purchasing.
  The Where Do We Go Now? publisher trailer similarly needs direct inspection.
- Review each exact Arabic variety/register. Artist nationality alone is not
  evidence for a song's dialect. The weekend episode's variety remains unknown.
  No linguistic or native-expert review is claimed.
- Check full content suitability and the amount of non-Arabic dialogue. Theeb
  has historical violence; Wadjda has religious-school/family themes. Where Do We
  Go Now? has religion/conflict/adult themes and needs an explicit owner editorial
  disposition before use. Replace it if unsuitable for the initial collections.
- Check actual text support and provide the original ungraded prompt/text
  alternative. Hal's artist page contains external lyrics, but none are stored
  or translated here. A synopsis is not a substitute for an accessible transcript.

These remaining checks keep **F21.1 open**. The owner is the final approver.

## Import and review

From the repository root:

```sh
npm run culture:import
```

This writes drafts only into the configured local API database, reports validation
issues and exits. It uses normal additive schema initialization. It does not start
a server, approve, publish, deploy, overwrite existing editions by default or touch
recordings/keys. The `.NET` launcher reads its normal application configuration;
unlike `npm run api`, this command does not load root `.env` files.

To refresh an existing draft deliberately, the underlying command accepts
`--update-import-drafts=true`; approved/published revisions are still preserved.
To target an isolated database, set `Database__Path` to its absolute path before
the command. Do not use production database/hosting access without authorization.

In the owner console, choose **Watch & listen**. Select an imported edition, review
the JSON and card preview, fill the exact evidence gaps, and save. Validate, then
approve and publish the exact revision only after final review. A saved edit to
approved/published content creates a new draft. A different week needs a new ID.
The console also accepts individual raw edition JSON files through its file input.

Replacement candidates are intentionally not importable editions. Incorporate a
reviewed candidate into a new version of the affected complete collection; do not
substitute its URL silently or use it to fill two primary slots.
