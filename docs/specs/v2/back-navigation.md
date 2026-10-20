# Back navigation

**Status:** Done

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

## Decisions

1. **Full stack** of previously active screens (not just "last screen").
2. **Entered controls first:** a back tap still exits an entered list /
   scroll container / reader before it navigates. Only when nothing is
   entered does it go back a screen.
3. **Overlays first:** keyboard, select modal, toast and sticky overlay
   keep their own dismiss handling; back only navigates when no overlay
   captured the tap.
4. **Replaces the footer Home icon:** the per-screen footer Home icon is
   removed; back is the way out.

## Proposed Design

**History stack.** A small fixed-size stack (16 entries, oldest dropped when
full) of screen entries. An entry is a `ScreenId`, plus the recording id and
source page when the screen is Details (the only screen whose state isn't
retained by its runtime).

**Recording history.** Every screen change goes through one app_shell
helper in place of calling `display_service::SetCurrentScreen` directly:

- Navigating to a screen that is already on the stack truncates the stack
  to just below that entry and does not push the current screen. This is
  what makes a back, and any existing hard-coded "Back" button, collapse
  history instead of growing it (Settings -> Storage -> Back to Settings
  leaves the stack unchanged).
- Otherwise the screen being left is pushed.
- Home clears the stack (it is the root).
- Onboarding and the lock screen are never pushed and never targets.

**Back gesture.** `button_service::IsBackGesture` (quick `ACTION` tap). In
`HandleDispatchedButtonEvent`, if overlay focus and the page handler did not
consume the tap, it pops the top entry and shows that screen. On Home, or
with an empty stack, it does nothing. It is ignored while a recording
session is not idle, so tapping during record/review can't navigate.
Press-and-hold `ACTION` (record) and long-press `DOWN` (scroll) are
unchanged.

**Footer.** Remove the Home footer icon from every screen's layout and
navigation model. Mic stays; Home keeps Sticky until
[stickies-deprecation.md](stickies-deprecation.md) lands.

**Rollout.** Step 1: history + back gesture (additive). Step 2: remove the
footer Home icon once back is verified on the device.

## Open Questions

None blocking.

## Acceptance Criteria

- From Home, opening Notes -> a day -> a recording's Details, then tapping
  back repeatedly returns Details -> day list -> Notes -> Home, one step
  per tap, and does nothing on Home.
- With an item list or reader entered, the first back tap exits it and the
  second navigates.
- With a keyboard or select modal open, back dismisses it and stays on the
  screen.
- Back during recording, review playback or the tag menu does not navigate.
- Settings sub-pages return to the Settings hub and then Home.
- No footer Home icon appears on any screen after step 2.

## Related

- [footer-redesign.md](footer-redesign.md) — overlapping navigation concerns
