# FollowUp rework

**Status:** Draft

## Summary

Rework or potentially deprecate the FollowUp screen/feature outright.
Decision not yet made.

## Problem / Motivation

Craig has flagged FollowUp as needing a rethink for V2, up to and including
removing it entirely — not yet decided which.

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

TBD — depends on the rework-vs-deprecate decision.

## Non-Goals

TBD.

## Proposed Design

TBD — needs a decision first: rework, or deprecate outright.

## Open Questions

- Rework or deprecate? Not yet decided.
- If reworked: what does FollowUp become — different from Notes/Todos in
  what way?
- If deprecated: what happens to existing FollowUp-tagged data on device
  (migration, hide-but-keep, or removal)?
- Sticky notes currently browse FollowUp entries specifically — does
  deprecating Stickies (see [stickies-deprecation.md](stickies-deprecation.md))
  happen regardless of FollowUp's fate, or are they decided together?

## Acceptance Criteria

TBD — needs design conversation and a rework-vs-deprecate decision.

## Related

- [stickies-deprecation.md](stickies-deprecation.md) — Stickies currently browses FollowUp entries
- [notes-todos-format.md](notes-todos-format.md) — shares FollowUp's current list format
- [home-screen.md](home-screen.md) — FollowUp's Home menu presence depends on this outcome
