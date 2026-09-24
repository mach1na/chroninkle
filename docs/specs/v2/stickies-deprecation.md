# Stickies deprecation

**Status:** Draft

## Summary

Deprecate the sticky-note overlay feature.

## Problem / Motivation

Craig wants Stickies removed for V2.

## Current Behavior

- The sticky note is an overlay (not a screen), opened via the footer
  Sticky button, which "flips through the follow-up notes" (Prev/Next
  wrap, Close), with a Details-style scroll container for each transcript.
- Implemented in `main/overlay_runtime.cpp` (back-gesture handling at
  line ~994).
- Its entry point (the footer Sticky button) is already going away under
  [footer-redesign.md](footer-redesign.md).
- It specifically browses FollowUp entries — see
  [followup-rework.md](followup-rework.md) for how that feature's own fate
  is being decided.

## Goals

- Remove the sticky-note overlay and its footer entry point.

## Non-Goals

- TBD.

## Proposed Design

TBD — mechanically this is a removal (overlay implementation, footer
button, associated `SurfaceKey`/refresh wiring), but sequencing depends on
[followup-rework.md](followup-rework.md) and [footer-redesign.md](footer-redesign.md)
landing first.

## Open Questions

- Any functionality from Stickies worth preserving elsewhere (e.g. does
  "flip through follow-up notes" map onto some future FollowUp or
  Notes/Todos browsing affordance), or is it a clean removal?
- Sequencing: does this wait on [followup-rework.md](followup-rework.md)'s decision, or proceed independently since the footer entry point is going away regardless?

## Acceptance Criteria

TBD — needs design conversation.

## Related

- [footer-redesign.md](footer-redesign.md) — removes the Sticky footer button
- [followup-rework.md](followup-rework.md) — Stickies currently browses FollowUp entries specifically
