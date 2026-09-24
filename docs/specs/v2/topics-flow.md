# Topics flow

**Status:** Draft

## Summary

Design a more intuitive flow for adding topics to a recording/entry.

## Problem / Motivation

Craig wants topic-tagging to be easier/more discoverable than the current
flow — specifics of what's wrong with it and what replaces it not yet
defined.

## Current Behavior

- `topic_service::Topic` is a user-defined label, orthogonal to the fixed
  3-way `RecordingMetadata::tag` (`RecordingTag`: Note / Todo / Idea)
  chosen during the record flow's tag menu.
- Entries reference topics by stable `id` (never by name) via
  `RecordingMetadata::topic_ids`, seeded with three defaults (Home, Car,
  Shopping) on first run.
- `kTopicsBrowse` / `kTopicEntries` browse recordings by topic, reusing the
  same timeline format as Notes/Todos (see
  [notes-todos-format.md](notes-todos-format.md)).
- (Exact current UI path for *attaching* a topic to an entry — e.g. at
  record time vs. after the fact from Details — needs confirming from code
  when this spec moves toward `Ready`; not fully traced in this pass.)

## Goals

TBD — needs design conversation.

## Non-Goals

TBD.

## Proposed Design

TBD — needs design conversation.

## Open Questions

- What's unintuitive about the current flow specifically (discoverability,
  number of steps, timing — at record time vs. after)?
- Does the new flow change when a topic can be attached (record time only,
  or also retroactively from Details/Notes/Todos)?
- Does this interact with the Notes/Todos/Topics browsing format change in
  [notes-todos-format.md](notes-todos-format.md)?

## Acceptance Criteria

TBD — needs design conversation.

## Related

- [notes-todos-format.md](notes-todos-format.md) — Topics browsing shares this format today
- [home-screen.md](home-screen.md) — Topics entry point
