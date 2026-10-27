# Visual assets (logo, icons, font)

**Status:** Draft

## Summary

V2 introduces a new hand-crafted pixel-art project logo, a new pixel-art
icon set (replacing text-based UI elements across Home and subscreens), and
a new default font (replacing the current Inter-based font), sourced by
Craig as royalty-free/open-source.

**Release-blocking (2026-10-27):** the new logo and the new font are
required for `2.0.0`. V2 does not ship on Inter and `kFollowupLogo`. They don't
block the other specs, which can proceed in the meantime.

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
- Pixel-art icon sources can be drawn smaller than the embedded target
  size (e.g. 16x16 or 32x32) and the generator nearest-neighbor-upscales
  them automatically, as long as the source size evenly divides the
  target (see `docs/asset-generation.md`) — so Craig can design at a true
  pixel-art grid instead of the final embed resolution.
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

**Icon source (2026-10-20):** [Pixelarticons](https://pixelarticons.com)
2.4.2 (MIT, 24x24 pixel grid, SVG). Only the icons in use are tracked under
`assets/V2/pixelarticons/` (with its `LICENSE`); the full set lives locally,
gitignored, in `assets/V2/pixelarticons-library/` for future picks. 24px divides 96px at an exact
4x, so the pipeline's pixel-art auto-upscale applies (it does *not* divide
112px). Home menu picks:

| Home item | Icon |
| --- | --- |
| Todos | `bulletlist-sharp` |
| Notes | `notebook` |
| Topics | `album` |
| Books | `book-open` |
| Follow Up | `circle-question` |

All five convert cleanly to 96x96 1-bit through the generator. Still to
decide: whether to keep the mix of sharp and regular corner styles.

**Replacement for the existing `assets/icons/` set (2026-10-20):** current
icon name = Pixelarticons icon. BLE icons are skipped (the firmware doesn't
use them). Where a name is repeated, two slots intentionally share one glyph.

```
add = plus-box                  remove = minus-box            close = close
delete = trash                  check = check                 checkbox-checked = checkbox-on
checkbox-unchecked = checkbox   chevron-left = chevron-left   chevron-right = chevron-right
home = home                     settings = settings-cog       NEW settings (Home/footer) = settings-cog
mic-on = mic                    mic-off = mic-off             keyboard = keyboard
lock = lock                     power = power                 refresh = refresh-solid
folder = folder                 folder-open = folder          file = files
file-audio = audio-waveform     file-json = file-text         file-md = file-text
file-transcript = text-align-left   star = robot              sticky = sticky-note-text
idea = lightbulb                goal = goal                   time = clock
visible = eye                   invisible = eye-off           audio = audio-waveform
bat_1 (<=10%) = battery         bat_2 (11-30%) = battery-low  bat_3 (31-50%) = battery-medium
bat_4 (51-75%) = battery-medium bat_5 (76-100%) = battery-full bat_6 (charging) = plug-solid
usb-storage = usb               sleep = moon                  ai-connect = robot-face-sad
transcribe = ai-voice           gemini_api = sparkle          api-key = key
pin = map-pin                   select = chevrons-vertical    sd_card = memory-stick
task-start = play               wifi_config = wifi
wifi_1 = letter-x-circle        wifi_2 = cellular-signal-3    wifi_2bar = cellular-signal-2
wifi_3 = circle-info-solid      wifi_3bar = cellular-signal-3 wifi_4 = wifi
```

Not yet decided: final icon sizes for the small tier (24px source scales
cleanly to 24/48/72px, not 36px), and the actual manifest wiring.

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
