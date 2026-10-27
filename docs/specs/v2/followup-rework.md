# FollowUp rework

**Status:** Draft

## Summary

**Decision (2026-10-27): deprecate Follow-up.** The Follow-up flag and the
Follow-ups screen are removed from the V2 UI. Existing follow-up data stays
on the SD card, hidden rather than deleted, so the decision is reversible.

## Problem / Motivation

Craig flagged FollowUp as needing a rethink for V2. He has now decided to
deprecate it rather than rework it (see Summary).

## Current Behavior

- `kFollowUp` is a recording timeline (two-level: date-group chips → an
  entered, scrollable item list) built on the same `timeline_list`/
  `timeline_format` primitives as Notes/Todos (see
  [notes-todos-format.md](notes-todos-format.md)).
- Appears as a menu item with a badge count on the Home screen (see
  [home-screen.md](home-screen.md)).
- The sticky-note overlay (see [stickies-deprecation.md](stickies-deprecation.md))
  "flips through the follow-up notes" — i.e. Stickies is currently a
  FollowUp-specific view, so its deprecation and FollowUp's rework/
  deprecation are closely linked.

## Goals

- Remove the Follow-up flag, its actions (Follow up / Remove follow-up /
  Complete follow-up) and the Follow-ups screen from the V2 UI.
- Keep existing follow-up data on the SD card, unmodified.

## Non-Goals

- Deleting or migrating existing follow-up data.
- Reworking Follow-up into a new feature.

## Proposed Design

Deprecate: hide the flag, keep the data. See [GLOSSARY.md](../../../GLOSSARY.md)
("Follow-up" is listed under Deprecated). Remaining UI detail (which
Home-grid slot the Follow-ups tile frees up, what replaces the Details-page
actions) is still to be settled with [home-screen.md](home-screen.md) and
[footer-redesign.md](footer-redesign.md).

## Open Questions

- ~~Rework or deprecate?~~ Deprecate (2026-10-27).
- ~~What happens to existing data?~~ Hide but keep (2026-10-27).
- ~~Does Stickies deprecation depend on this?~~ Resolved: the sticky-note
  overlay is already removed (see [stickies-deprecation.md](stickies-deprecation.md)).
- What takes over the Follow-ups tile's slot on the Home grid?
- If the flag is hidden, what happens to an entry that is flagged and
  incomplete: does it reappear normally in Notes/To-dos with no marker?

## Acceptance Criteria

- No Follow-up flag, action or screen is reachable in the UI.
- Existing follow-up entries still appear normally in Notes/To-dos and are
  not modified or deleted on the SD card.
- `docs/user-manual.md` no longer describes Follow-up.

## Related

- [stickies-deprecation.md](stickies-deprecation.md) — Stickies browsed FollowUp entries (since removed)
- [notes-todos-format.md](notes-todos-format.md) — shares FollowUp's current list format
- [home-screen.md](home-screen.md) — FollowUp's Home menu presence depends on this outcome
