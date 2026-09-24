# Footer redesign

**Status:** Draft

## Summary

Remove the current per-screen "context options" footer icons (Settings,
Sticky) and replace them with elements that fit the new icon-based visual
design. The Mic (record) footer element is confirmed to stay; the
replacement for Settings/Sticky is not decided yet.

## Problem / Motivation

The current footer's context-option icons were designed around the v1
visual language; Craig wants footer content that fits the new design
rather than a like-for-like icon swap.

## Current Behavior

- Per-screen footer layout is defined in `main/app_shell.cpp:170-196`
  (`FooterLayoutForScreen`): Home shows Settings + Sticky (no Home icon);
  every other screen shows Home only (no Settings/Sticky); Mic is always
  visible.
- WiFi/Time footer icons are already dead code paths (`show_wifi`/
  `show_time` permanently false — reached via the Settings hub instead).
- Projected into `epaper_ui::GlobalFooterState` by `main/footer_runtime.cpp`;
  each page's `NavigationModel`/`AddFooterItems` mirrors the same
  visibility split so focus can't land on a hidden icon.
- The footer Sticky button opens the sticky-note overlay, which is being
  deprecated separately (see [stickies-deprecation.md](stickies-deprecation.md)) —
  so its footer entry point goes away regardless of what replaces it.

## Goals

- Footer visual language matches the new icon-based design.
- Mic (record) stays.

## Non-Goals

- TBD.

## Proposed Design

TBD — needs design conversation. Likely interacts with
[back-navigation.md](back-navigation.md): if back navigation becomes
universal/history-aware, the footer's per-screen Home-icon convention may
also need rethinking.

## Open Questions

- What replaces Settings/Sticky in the footer, if anything?
- Does every screen still need an explicit "Home" footer icon once
  [back-navigation.md](back-navigation.md) makes back universal, or does
  back navigation subsume that?

## Acceptance Criteria

TBD — needs design conversation.

## Related

- [back-navigation.md](back-navigation.md) — likely overlapping navigation concerns
- [stickies-deprecation.md](stickies-deprecation.md) — removes the Sticky footer entry point
- [visual-assets.md](visual-assets.md) — new footer icons needed once shape is decided
