# Home screen

**Status:** Draft

## Summary

Redesign the Home screen (`kHome`) from a text/copy-driven dashboard to an
icon-based menu, and remove the rotating "motivational"/welcome-message
copy entirely.

## Problem / Motivation

V1's Home screen leads with encouraging prose ("What's on your mind?") and
text-labeled menu items. V2 moves to a graphical, icon-based interface —
Home is the first and most visible surface this affects.

## Current Behavior

- Composed by `main/dashboard_page_coordinator.cpp` `BuildState()`
  (~lines 129-165).
- A rotating welcome message: 5 canned phrases in
  `components/epaper_ui/welcome_message.cpp:12-15`, picked by a per-boot
  random seed that advances hourly via
  `CONFIG_CHRONINKLE_WELCOME_MESSAGE_ROTATE_HOURS`, shown with the current
  date.
- Either a first-capture invitation banner (empty archive) or a "Task
  tracker" progress bar (`done/total` completed todos).
- A feature menu: Notes / Todos / FollowUp, each with a text label and
  badge count.
- Footer on Home shows Settings + Sticky (see [footer-redesign.md](footer-redesign.md)).

## Goals

- Icon-based feature menu (Notes/Todos/FollowUp, or whatever V2's screen
  set ends up being per [followup-rework.md](followup-rework.md)).
- No rotating welcome-message/motivational copy.

## Non-Goals

- TBD.

## Proposed Design

TBD — needs a design conversation. Open items: does the date/progress
information (first-capture banner, task-tracker bar) survive in some
graphical form, or go away with the text copy? What replaces badge counts
visually?

## Open Questions

- Does `components/epaper_ui/welcome_message.cpp` get deleted outright, or
  repurposed (e.g. just the date display kept)?
- Does the "Task tracker" progress bar concept carry over graphically, or
  is it dropped along with the motivational copy?
- Final V2 feature set on Home depends on [followup-rework.md](followup-rework.md)'s
  outcome (FollowUp may not exist as a menu item).

## Acceptance Criteria

TBD — needs design conversation.

## Related

- [visual-assets.md](visual-assets.md) — new icon set needed for the menu
- [footer-redesign.md](footer-redesign.md) — Home's footer is redesigned separately
- [followup-rework.md](followup-rework.md) — affects whether FollowUp stays a menu item
