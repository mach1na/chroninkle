# Visual assets (logo, icons, font)

**Status:** Draft

## Summary

V2 introduces a new hand-crafted pixel-art project logo, a new pixel-art
icon set (replacing text-based UI elements across Home and subscreens), and
a new default font (replacing the current Inter-based font), sourced by
Craig as royalty-free/open-source.

## Problem / Motivation

The graphical/icon-based V2 redesign depends on new visual assets that
don't exist yet. This spec tracks the asset pipeline/integration side;
Craig owns actually producing the assets (tracked in
`design/v2-resource-manifest.md`, gitignored, repo root).

## Current Behavior

- Icons/logos are manifest-driven: source images + `assets/
  epaper_assets.json` → `scripts/generate_epaper_project_assets.py` →
  generated C++ in `components/project_assets` (lookup API: `GetLogo` /
  `GetIcon` / `GetFooterIcon`, see `docs/app-architecture.md`). Never
  hand-edit the generated files.
- Fonts: source TTFs in `fonts/*.ttf` → `scripts/generate_epaper_fonts.py`
  → `components/epaper_ui/generated_epaper_fonts.{cpp,h}`. Currently
  Inter-based.
- `kFollowupLogo` is an intentional exception per `CLAUDE.md`: the original
  Followup wordmark, kept for the boot splash's "Based on" attribution
  line — not a stale identifier to rename or remove without a decision.
- See `docs/asset-generation.md` for the full pipeline.

## Goals

- New pixel-art logo integrated via the existing asset pipeline.
- New pixel-art icon set covering whatever V2's icon-based UI needs (Home
  menu items, badges/status glyphs, footer elements per
  [footer-redesign.md](footer-redesign.md)).
- New default font, license-verified for firmware embedding (not just
  "free to view" — needs redistribution/embedding rights).

## Non-Goals

- Changing the asset generation pipeline/scripts themselves — this is
  about new source assets flowing through the existing pipeline, not
  pipeline changes, unless a specific gap is found.

## Proposed Design

TBD — will firm up as `design/v2-resource-manifest.md` items land.

## Open Questions

- Does the new pixel-art logo replace `kFollowupLogo`'s boot-splash role,
  or does the attribution line stay alongside the new primary logo?
- Full icon inventory: exact list of icons needed depends on
  [home-screen.md](home-screen.md), [footer-redesign.md](footer-redesign.md),
  and other specs reaching `Ready` first — inventory to be finalized in
  `design/v2-resource-manifest.md` as those land.
- Font candidate not chosen yet.

## Acceptance Criteria

TBD — needs design conversation, and Craig's asset delivery.

## Related

- `design/v2-resource-manifest.md` (gitignored, repo root) — the actual
  resource checklist/tracker
- [home-screen.md](home-screen.md), [footer-redesign.md](footer-redesign.md) — primary icon consumers
- `docs/asset-generation.md` — pipeline reference
