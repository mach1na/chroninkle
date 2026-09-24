# Back navigation

**Status:** Draft

## Summary

Make the record/back button's back behavior universal: pressing back
returns the user to the last screen they were on, regardless of whether
they're inside a list/entered control, rather than today's narrower
"exit the current entered control" behavior.

## Problem / Motivation

Today's back gesture doesn't behave like real screen-history navigation —
it's a no-op unless something is "entered," so getting back to a previous
*screen* often requires the footer's Home icon instead. Craig wants one
consistent back gesture that always works.

## Current Behavior

- `button_service::IsBackGesture` fires on a single `ACTION`/BOOT tap. It's
  screen-agnostic but **not** history-aware: it means "exit whatever
  entered sub-control is currently active" (a scroll container or item
  list), handled independently per-screen in `main/page_input_runtime.cpp`
  (7 call sites) and in `main/overlay_runtime.cpp` (line ~994, for the
  sticky note overlay).
- There is no back-stack. If nothing is "entered," the gesture is a no-op.
- Long-press `DOWN` is deliberately *not* part of the back gesture — that
  hold is reserved for continuous scrolling within an entered control.
  (This distinction should be preserved unless explicitly revisited.)
- `ACTION` is overloaded: a quick tap is back/exit; press-and-hold arms/
  starts/stops a recording. Any redesign must keep these unambiguous.

## Goals

- One back gesture that always returns to the previously active screen,
  independent of entered/not-entered state.

## Non-Goals

- Changing what triggers a recording (press-and-hold `ACTION` stays as is).
- Changing the entered-control exit behavior *within* a screen, unless that
  turns out to be the same mechanism as screen-level back.

## Proposed Design

TBD — needs design conversation. This is a real architectural change (a
navigation-history concept doesn't exist today), not a copy/asset change.
Needs to define: how deep does the history go (one level back, or a full
stack)? Does entering/exiting a list still consume a back-press first, or
does back always jump a full screen now? How does this interact with
overlays (keyboard/toast/modals), which already have their own dismiss
handling?

## Open Questions

- Single-level "last screen" vs. a real navigation stack?
- Interaction with overlay input capture (`overlay_runtime::
  IsInputCaptured()`) — overlays already suppress underlay refresh; does
  back-while-overlay-open dismiss the overlay first, or is that unchanged?
- Does this replace the footer's per-screen Home icon (see
  [footer-redesign.md](footer-redesign.md)), or coexist with it?

## Acceptance Criteria

TBD — needs design conversation.

## Related

- [footer-redesign.md](footer-redesign.md) — overlapping navigation concerns
