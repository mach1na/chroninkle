# Notes/Todos format

**Status:** Draft

## Summary

Replace the current two-level timeline format used by the Notes and Todos
screens with something more intuitive. Shape not decided yet — this spec
is a placeholder to hold the design once that conversation happens, not a
proposal.

## Problem / Motivation

Craig wants to move away from the timeline browsing model for V2 but
hasn't yet defined the replacement — explicitly deferred to a future
design conversation.

## Current Behavior

- `kNotes` and `kTodos` are two-level recording timelines: date-group chips
  → an entered, scrollable item list, built on the `timeline_list`
  primitive and `timeline_format` (see `docs/app-architecture.md`).
- `kTopicsBrowse` / `kTopicEntries` reuse the same shape, filtered by
  `topic_ids` — a format change here likely affects Topics browsing too
  (see [topics-flow.md](topics-flow.md)).
- `kFollowUp` also currently uses this shape, but its fate is being decided
  separately (see [followup-rework.md](followup-rework.md)).

## Goals

TBD — needs design conversation.

## Non-Goals

TBD.

## Proposed Design

TBD — explicitly deferred; no proposal yet.

## Open Questions

- What replaces the timeline shape? (Open per Craig: "We can talk about
  ideas for that when we get there.")
- Does the replacement apply uniformly to Notes, Todos, and Topics
  browsing, or could they diverge?
- Does this format change also apply to FollowUp if it survives
  [followup-rework.md](followup-rework.md)?

## Acceptance Criteria

TBD — needs design conversation.

## Related

- [topics-flow.md](topics-flow.md) — Topics browsing reuses this format today
- [followup-rework.md](followup-rework.md) — FollowUp reuses this format today
- [home-screen.md](home-screen.md) — entry point into these screens
