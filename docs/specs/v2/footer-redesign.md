# Footer redesign

**Status:** Done

## Summary

The footer is now just the Mic (press-and-hold-to-record) button on every
screen. The per-screen "context options" icons (Settings, Sticky, Home) were
removed rather than replaced: Settings became a Home grid tile, the sticky-note
overlay was deprecated, and the universal Back gesture replaced the Home icon.
Decided 2026-10-27: this is the final footer design.

## Problem / Motivation

The current footer's context-option icons were designed around the v1
visual language; Craig wants footer content that fits the new design
rather than a like-for-like icon swap.

## Current Behavior

- `FooterLayoutForScreen` (`main/app_shell.cpp`) returns the same layout for
  every screen: Mic visible; Settings, Home, WiFi and Time hidden.
- No page's `NavigationModel` places a footer item, so roving focus can't
  land on a hidden icon. The footer runtime/widget still carry the other
  buttons' plumbing, left in place rather than swept out of every page.
- WiFi/Time are reached from the Settings hub, not the footer.

## Goals

- Footer visual language matches the new icon-based design.
- Mic (record) stays.

## Non-Goals

- TBD.

## Proposed Design

Mic-only footer on every screen, as implemented (see Current Behavior). Back
navigation (see [back-navigation.md](back-navigation.md)) replaced the Home icon.

## Open Questions

- ~~What replaces Settings/Sticky in the footer?~~ Nothing: Settings is a Home
  grid tile and Stickies were removed.
- ~~Does every screen still need a Home footer icon?~~ No: Back subsumes it.

## Acceptance Criteria

- The footer shows only the Mic button on every screen.
- No hidden footer item can receive focus.

## Related

- [back-navigation.md](back-navigation.md) — likely overlapping navigation concerns
- [stickies-deprecation.md](stickies-deprecation.md) — removes the Sticky footer entry point
- [visual-assets.md](visual-assets.md) — the Mic icon may be redrawn to match the new style
