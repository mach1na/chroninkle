# TODO

Open items only. Resolved/closed items (with full investigation and
verification history) have moved to `docs/todo-archive.md`.

## Redundant derived state: icon/checked fields duplicate their source bool

`TimelineEntry` (in `notes_page_coordinator.h:16-21` and mirrored in
todos/follow_up) stores both a source-of-truth bool (`follow_up`/
`completed`) and a separately-computed rendered projection
(`tag_icon_asset`/`accessory.checked`), which has to be kept in sync by
hand at 2 call sites per page (`notes_page_coordinator.cpp:81,303`,
matching lines in todos/follow_up). A future third place that flips
`follow_up`/`completed` (e.g. a bulk "mark all done" action) could easily
forget to update the mirror field.

Fix: derive the icon/checked state in `BuildState()` at render time instead
of storing it. The page-trio refactor (see `docs/todo-archive.md`) left
`TimelineEntry` and its mutators page-specific, so this is still open and
would now touch each page's `BuildState()`/`SetEntryFollowUpState`/
`SetEntryChecked` individually rather than a single shared spot.

## IMU auto-sleep motion detection polls instead of using the hardware interrupt path

`main/device_sleep_runtime.cpp:608-637` (`MotionPollingTask`) wakes every
200ms to do a full I2C read + float-math classification purely to detect
stillness for auto-sleep — but `components/qmi8658/qmi8658.cc` already
implements complete hardware any-motion/no-motion detection via INT2
(`ConfigMotion`, `EnableWakeOnMotion`, callbacks at lines ~877-1470), the
same mechanism already wired for the light-sleep wake gesture.
`components/imu_service/imu_service.cpp` never surfaces any of it — only
`ReadSample`. Continuous I2C polling on a battery-powered device where an
event-driven equivalent already exists elsewhere in the same driver.

## `FitLabelText` still independently reimplemented in two places

`network_item.cpp` and `select_item.cpp` each still have their own private
copy of `FitLabelText` (truncate-with-ellipsis), with the parameters in a
different order (`text, role, max_width`) than the shared version already
promoted to `render_utils.h` (`role, text, max_width`) — which is exactly
why they didn't collide with it and get caught by the build the way two
other duplicates already were (see the archived "Replace the lock screen's
full-screen clock with a todo summary" item). Finishing the dedup means
normalizing one of the two parameter orders and updating call sites in
whichever files change.

## Replace auto light sleep with a full auto shutdown

Today, after `FOLLOWUP_AUTO_SLEEP_LIGHT_SLEEP_TIMEOUT_SECONDS` of IMU-detected
inactivity (default 1800s / 30 minutes, `main/Kconfig.projbuild:71-79`), the
device enters light sleep: `device_sleep_service::Action::kEnterLightSleep` is
dispatched to `EnterLightSleep()` in `main/device_sleep_runtime.cpp:490-492`,
which stops Wi-Fi, puts the display to sleep, and arms a GPIO wake.

Craig's reasoning: waking back up from light sleep already costs about the
same time as booting from scratch (`RestoreAfterLightSleep()` has to redo a
real Wi-Fi reassociation and a forced SD remount — see the comment on
`ForceDisplaySleep`'s Wi-Fi-reassociation cost in `lock_screen_runtime.cpp`'s
`Show()`), so light sleep isn't actually buying much wake-latency benefit
over a full power-off at that point, while a full shutdown saves
meaningfully more battery. Wanted: once the light-sleep timeout elapses, the
device should fully shut off (same mechanism as a manual shutdown,
`power_service::RequestShutdown()`) instead of entering light sleep — and
this auto-triggered shutdown should freeze on the lock/shutdown screen the
same way a manual shutdown now does (`lock_screen_runtime::ShowForShutdown()`,
added for the "Full shutdown should freeze on the lock screen's todo
summary" item, `docs/todo-archive.md`).

Open questions for whoever designs this:
- Whether to repurpose `FOLLOWUP_AUTO_SLEEP_LIGHT_SLEEP_TIMEOUT_SECONDS` as
  the auto-shutdown timeout directly, or add a distinct Kconfig option —
  "light sleep" and "auto shutdown" are conceptually different features even
  if this item replaces one with the other at the same trigger point.
- The same `BlockerReason`s that already gate light sleep (recording active,
  recording saving, audio playback, storage write, Wi-Fi AP mode, time sync,
  display refresh — `components/device_sleep_service/include/device_sleep_service.h:39-45`,
  checked in `main/device_sleep_runtime.cpp`'s blocker-evaluation function)
  presumably should gate auto-shutdown too.
- The USB-present case: `power_service::RequestShutdown()` doesn't actually
  cut power while VBUS is present — the call returns and the board stays
  running. Auto light sleep today still works fine on USB power (Wi-Fi
  stops, display sleeps, GPIO wake still armed). If auto-shutdown fires
  while on USB, naively reusing `RequestShutdown()` would leave the device
  sitting on the frozen lock/shutdown screen, powered but not actually
  asleep or off, until a button press — a real regression from today's
  behavior on a plugged-in device. Worth deciding whether auto-shutdown
  should only trigger on battery power, falling back to today's light-sleep
  behavior while USB is present.
- This is a real, deliberate UX change beyond just "one more sleep stage":
  today, any button instantly wakes the device from light sleep; after this
  change, once the timeout elapses, waking requires a full boot cycle (PWR
  press through the AXP2101's normal power-on path) instead. That's exactly
  the tradeoff Craig wants (his read: the wake cost is already boot-cost
  today), but it's worth calling out explicitly since it's a bigger
  behavioral change than the wording ("shut off instead of light sleep")
  might suggest at a glance.

Own branch/PR.

## v2: visible notification when a queued transcription retry gives up

Found during live field testing (2026-09-24): a recording that's queued for
automatic retry (`pending_transcription=true` in its archive metadata --
this only happens for a recording saved while Gemini wasn't ready, e.g. no
Wi-Fi at record time) gets exactly **one** automatic retry attempt the next
time Gemini reconnects (`transcription_retry_service::RetryOne()`,
triggered by `RetryPending()` off a Gemini ready-edge in
`main/app_shell.cpp`'s `HandleGeminiEvent`). If that one attempt fails for
*any* reason -- including a plainly transient one, like the
`http=503 code=UNAVAILABLE "This model is currently experiencing high
demand"` error hit during testing today -- `RetryOne()` calls
`recording_archive_service::ClearPendingTranscription()` unconditionally
and gives up for good. The recording is left with a saved audio clip, no
transcript, and a `transcription_error` string in its metadata, but nothing
about it is surfaced anywhere in the UI beyond the Details page's own
status text for that one recording -- there's no dashboard/status-bar
indicator that says "N recordings need a manual retry." The only way to
notice is opening that specific recording's Details page and using the
manual **Transcribe** button (`with_transcribe` in
`BuildDetailsPageNavigationModel`).

Craig wants a visible, at-a-glance notification for this in v2 (deferred,
not an immediate fix) -- something like a status-bar badge or dashboard
callout showing "N recordings failed to transcribe" so a transient failure
like today's doesn't silently strand a recording without transcript
indefinitely.

Related but separate: whether `RetryOne()`'s one-shot-then-give-up policy
itself should change (e.g. distinguish a transient error -- 5xx, timeout,
network -- from a permanent one -- bad API key, malformed request -- and
only clear `pending_transcription` on the latter, keeping transient
failures queued for the next reconnect) is its own decision, not yet made;
raised in conversation the same day but intentionally not resolved here.

## v2: complete front-end rewrite (drop optimistic phrases, go icon-based)

Craig wants to start planning a v2 (2026-09-24): a complete rewrite of the
on-device UI, moving away from the current text/"optimistic phrase"-driven
copy (status lines, prompts, empty-states written as encouraging sentences)
toward a more graphical, icon-based interface.

Unscoped so far — this is a placeholder for design/planning work, not an
implementation item yet. Open questions for whoever picks up the planning:
- What "optimistic phrases" means concretely — an audit of current
  user-facing copy across `epaper_ui` page renderers (status bar, toast,
  empty-states, footer hints) to catalog what gets replaced.
- What the icon-based replacement looks like per screen (Home, Notes/Todos/
  FollowUp, Topics, Settings, onboarding) — likely needs new assets via
  `components/project_assets` / `scripts/generate_epaper_project_assets.py`.
- Whether this is a redesign of the existing screen/widget set in place, or
  a genuine v2 (new `epaper_ui` widgets, possibly a new versioned branch
  line) — given `docs/versioning.md`'s SemVer policy, a rewrite this broad
  likely means a MAJOR bump and probably its own long-lived branch rather
  than a single feature branch.
- The Followup -> Chroninkle rename (naming, Kconfig namespace, GitHub repo)
  is fully done now (see `docs/todo-archive.md`), so this rewrite doesn't
  have to sequence around it or touch naming and visual design churn at
  the same time.

## v2: change the boot-up sound

Craig wants a new startup sound cue to go with the Chroninkle rebrand
(2026-09-13) — he'll make/source the audio himself later.

To swap it: replace `components/system_sound_service/sounds/startup.mp3`
with the new MP3 (same filename, no other changes needed), rebuild, flash.
No asset-generation script/pipeline involved, unlike the boot logo — the
MP3 is embedded directly via `EMBED_FILES` in
`components/system_sound_service/CMakeLists.txt`. Source can be any
standard MP3 (any sample rate/mono-or-stereo); the firmware decodes and
resamples/downmixes to mono 16kHz 16-bit PCM automatically to match the
ES8311 codec's fixed clock, though exporting at 16kHz mono directly avoids
any resampling artifacts. No hard size/duration cap, but it's embedded raw
into the firmware image and fully decoded to PCM in PSRAM on first play
(cached for the app's life, ~32KB/sec of audio) — existing cues are all
short blips, and `startup.mp3` is already the longest at a few seconds, so
keep the replacement in that ballpark.

