# Character study 02

October 8, 2026 · F06.1 · Rejected historical study.

The owner rejected this revision and scrapped programmatic SVG illustration.
This is not a pending candidate for integration; retain it only for comparison.

[Model sheet](model-sheet.svg) · [Rendered sheet](model-sheet.png) ·
[Desktop](preview-desktop.png) · [Mobile](preview-mobile.png) · [Preview](preview.html).

The owner rejected [study 01](../vector-concept-01/README.md) as too crude/angular
and observed that the hair stayed front-facing in the profile portraits.
Study 01 is retained as a rejected comparison, not an approved design.

## Changes

Replaced thick outlines and angular face/clothing constructions with smoother
Bézier contours, finer eyelids/brows, curved noses/lips, restrained solid shadow
shapes, hair-section curves and rounded necklines. Front expressions reuse identity
geometry. Profile heads have independently drawn cranium, forehead, ear, hairline,
back hair volume and beard silhouettes: the far side's hair and facial features
are omitted instead of carrying a frontal hair cap onto a turned face.

These are original SVG paths authored by Codex: AI-assisted vector illustration,
not a human illustrator commission or raster image-generation output. No third-party
artwork copied. [Provenance and exact source hashes](provenance.json).

## Verification and limits

Rendered in local Chromium at 1184px desktop and 390px mobile. All images loaded;
scroll width equaled viewport width at both sizes. Model sheet and mobile screenshot
visually inspected, including profile hair and 40/64/96px portrait examples. All
nine SVG documents parse and their recorded hashes match. PNGs are browser
rasterizations of SVGs. Rebuild source with `python3 docs/characters/vector-concept-02/build.py`.

Owner design review remains open. Attentive expressions are front-facing;
three-quarter turnarounds remain a possible refinement. This is not a claim of
professional illustrator quality or final acceptance. No app integration, production
registry changes, offline/fallback release checks, publication or deployment occurred.
