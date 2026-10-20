# Home screen

**Status:** Done

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
- A feature menu: Follow up / Todos / Notes / Topics / Books
  (`components/epaper_ui/dashboard_page.cpp` `kMenuLabels`), each a
  full-width, single-column text row (`menu_item::kHeight` = 72px), some
  with badge counts.
- Footer on Home shows Settings + Sticky (see [footer-redesign.md](footer-redesign.md)).

## Goals

- Icon-based feature menu (Notes/Todos/FollowUp, or whatever V2's screen
  set ends up being per [followup-rework.md](followup-rework.md)).
- No rotating welcome-message/motivational copy.

## Non-Goals

- TBD.

## Proposed Design

**Layout:** a 3-column icon grid replaces the single-column text menu,
with vertical scrolling for additional rows beyond what fits on screen.

Screen geometry (logical portrait canvas, 480×800): today's dashboard uses
16px side margins → 448px usable width, status bar is 44px, footer band is
~74px (58px button + 16px bottom padding) → roughly 680px usable height
once the welcome-message block above the menu is removed.

3-column candidates across 448px usable width (symmetric, no extra outer
margin beyond the existing 16px side margins):

| Icon size | Gap between icons |
| --- | --- |
| 96px | 32px |
| 112px | 16px |

Both are a new size tier — bigger than the existing `assets/icons/` 36px/
44px fixed sizes — so this isn't a reuse of the current icon catalog as-is.

**Focus navigation:** confirmed left-to-right, then top-to-bottom — i.e.
`DOWN` steps through each row's cells left→right, then continues onto the
next row's leftmost cell (not an alternating/boustrophedon snake); `UP`
reverses. This matches how the single-column list traverses today, just
wrapping every 3 cells instead of every 1 — no new button/gesture needed,
this board only has `UP`/`DOWN` for roving focus (no left/right).

**Icons:** Pixelarticons picks per menu item are recorded in
[visual-assets.md](visual-assets.md); their 24px grid favors the 96px/32px
option.

## Decisions

- **Layout:** 3 columns, 96px icons centred in 128px-wide cells with 32px
  gaps (3 x 128 + 2 x 32 = 448px usable width). The earlier 96px/32px and
  112px/16px table did not add up to 448px; cell width is the fixed value.
  24px Pixelarticons sources scale to 96px at an exact 4x.
- **Captions:** each icon has a small caption underneath.
- **Badges:** a corner badge at the top-right of the cell (white pill when
  the cell is selected).
- **Selection:** the whole cell inverts.
- **Top block:** only today's date remains; the welcome message, Task
  tracker bar and first-capture banner are removed, along with the
  rotation setting.
- **Menu items:** Follow up, Todos, Notes, Topics, Books and Settings
  (Settings moved from the footer into the grid). Follow up stays pending
  the [followup-rework.md](followup-rework.md) outcome.

## Not implemented

- Vertical scrolling for more than two rows (six items fit without it).
- Midnight date rollover: the date only updates when something else
  repaints Home (the old hourly welcome refresh did this incidentally).

## Acceptance Criteria

- Home shows the date and a 3-column grid of six captioned icons.
- `DOWN`/`UP` move focus left-to-right, then top-to-bottom; the focused cell
  is inverted; Select opens the item.
- Settings opens the Settings hub and is no longer a footer icon.

## Related

- [visual-assets.md](visual-assets.md) — new icon set needed for the menu
- [footer-redesign.md](footer-redesign.md) — Home's footer is redesigned separately
- [followup-rework.md](followup-rework.md) — affects whether FollowUp stays a menu item
