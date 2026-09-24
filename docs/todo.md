# TODO

Open items only. Resolved/closed items (with full investigation and
verification history) have moved to `docs/todo-archive.md`.

## Full refreshes are too frequent / too visible

Craig's report (2026-09-11): full refreshes happen "rather egregiously" and
should be reduced further.

Every screen-to-screen navigation in `main/app_shell.cpp` (Home, Settings,
Wifi, Time, Notes, Todos, FollowUp, Details, Topics*, onboarding, ...) always
requests `display_service::RefreshMode::kFull` -- the slowest, most thorough
waveform (`EpaperPanel::RefreshFullBase()`), used unconditionally for every
page change, not just for ghost-clearing or wake/boot recovery.

The likely low-risk win: `RefreshMode::kFast` already exists end-to-end and
is unused. `display_service.h`/`epaper_panel.h` document it as "full-screen
redraw on the panel's fast OTP waveform: quicker than `RefreshFullBase`, but
clears accumulated ghosting less thoroughly" (`components/epaper_panel/ssd1677_driver.cpp:226-232`,
`RefreshFullBaseInternal(fast)` toggling the 0x1A temperature register between
the normal and OTP-fast waveform). `RefreshForMode()` in
`components/display_service/display_service.cpp:620-637` already dispatches
`kFast` to `panel.RefreshFastBase()` -- but nothing in `main/` or
`display_service` ever constructs a `RefreshRequest` with `kFast`. It was
built for exactly this "full-screen change, not a ghost flush" case and then
never wired up to a call site.

**Update (2026-09-11) -- it was tried, and rejected for a real reason.** Git
history answers the first open question below: commit `2e058a9` wired `kFast`
into exactly these two "automatic refresh" paths, and commit `ae15b27`
reverted it less than an hour later -- on this panel, the fast OTP waveform
"flashes like a full refresh but finishes grey," it doesn't reach full
contrast. So this isn't simply forgotten code; it's a known, real defect.

**Also checked whether another firmware for this board already solved it.**
Waveshare's own reference repo (`github.com/waveshareteam/ESP32-S3-ePaper-3.97`,
`ESP-IDF/08_ESP32-S3_e-Paper-3.97/components/epaper_port/epaper_port.c`) has
its own fast-mode init (`EPD_Init_Fast`), and its register sequence is
essentially byte-for-byte identical to ours -- including the exact same
forced temperature value, `0x1A = 0x6A`. So this was never a case of "we
have the wrong value, they have the right one." Their code comment just says
`//Fast(1.5s)`, treating it as expected behavior with no sign they scrutinized
contrast quality. Their own on-device reader (see the `.txt` reader item
below) doesn't even use fast mode for its page turns -- it uses plain
`kPartial`-equivalent refreshes instead, which is a hint that `kFast` may
just not be trustworthy on this panel for large-area content at all, at
least not at this forced-temperature value.

That reframes the fix: per the SSD1677 datasheet, the forced temperature
byte doesn't act as a continuous speed dial -- the controller does a banded
OTP lookup (about 8 temperature bands per the datasheet's example table,
"last matching band wins"), and `0x6A` (106 "degC") almost certainly lands in
the same topmost/fastest band as any other implausibly-hot value someone
might try (a community SSD1677 driver uses `0x5A`/90 "degC" for its fast
mode, which is likely in that same band and so likely no different in
practice -- not verified, but not promising either). Getting a genuinely
faster *and* full-contrast result probably means deliberately forcing a much
cooler value to land in a different OTP band, trading away some of the speed
win, found empirically since each panel's actual band boundaries are set at
manufacture and aren't published.

Open questions for whoever picks this up:
- Build the small on-device sweep harness discussed for this (cycle through
  candidate `0x1A` values with a button press, fire a real large-area swap
  on `kFast` each time, judge contrast) -- values should span a wide range
  (e.g. down through ~30/20/10/0 "degC"), not just nudge near `0x6A`.
- Should ordinary screen navigation switch to `kFast` while reserving `kFull`
  for the existing ghost-clear flush (`EpaperPanel::NeedsGhostingFlush()`,
  8-consecutive-partials trigger), wake/light-sleep recovery, and the
  boot/onboarding first paint (`docs/app-architecture.md`'s "Boot refresh
  policy")? Still the right target shape if a working value is found.
- Since `kFast` clears ghosting less thoroughly, does alternating
  navigation-triggers-kFast with the existing ghost-clear-flush-triggers-kFull
  keep visible ghosting acceptable, or does it need its own counter/ceiling
  separate from the partial-refresh ghost counter?
- Forcing a fixed temperature bypasses the panel's real temperature
  compensation -- worth checking whether a value that looks right at room
  temperature still holds up in a noticeably colder or warmer room.

**Fallback if the `kFast` tuning doesn't pan out (2026-09-11):** switch
navigation to `kPartial` (worth trying on real screens regardless -- cheap,
no waveform research needed, see the vendor-reader precedent on the `.txt`
reader item above) and add a manual "force full refresh" gesture as the
escape hatch for whatever ghosting that leaves behind, instead of only
relying on the automatic 8-partial ghost-clear flush. Doesn't fix a
single-shot undershoot the moment a large-area `kPartial` change happens
(that's a different failure mode than the gradual fade the automatic flush
already handles), but it's a cheap, low-risk thing to have either way, and
means a user who notices ghosting isn't stuck waiting for the next automatic
flush. Two things to work out if it's built: which gesture is actually free
(the current map -- `UP`/`DOWN` tilt, `ACTION`/`FN`, long-press `DOWN` for
"exit control", `PWR` reserved for the PMIC -- doesn't have an obvious
unclaimed slot) and whether it fully replaces the automatic flush or sits
alongside it as a backstop.

## Pin the AXP2101's 6s emergency power-off to actually power off

Found while investigating the (now-resolved, see `docs/todo-archive.md`)
PWR power-back-on flakiness. The AXP2101's "Function Select when
btn_pwroff_en=1" bit (REG22H bit 0 -- 0=Power-off, 1=Restart) is never
explicitly set by Folloup (`Axp2101::SetButtonPowerOffRestarts()` exists in
`components/axp2101/axp2101.h:56` but has zero call sites), so it sits at
its factory EFUSE default. `waveshare_board.cpp` enables "PWRON > OFFLEVEL
(6s) as a power-off source" (`SetButtonPowerOffEnabled(true)`), and
CLAUDE.md documents that 6s hold as "a hardware escape even if firmware is
wedged" -- but if the EFUSE default for that function-select bit happens to
be "Restart," the emergency 6s hold would reboot the board instead of cutting
power, contradicting that guarantee.

Fix: call `SetButtonPowerOffRestarts(false)` explicitly in
`ConfigurePmicRails` (`components/board/waveshare_board.cpp`) so this
doesn't depend on an unverified factory default. Low-risk, self-contained --
worth doing on its own branch rather than folding into unrelated work.

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

## Finish the Followup -> Chroninkle rename

Craig decided (2026-09-13) to rename the project from Followup to
**Chroninkle**, since it's diverged enough from the original Followup
concept to warrant its own identity. The boot splash, `README.md`, and
`docs/user-manual.md` already lead with the new name and logo (the Followup
and ALXV Labs logos it grew from moved to a "Based on" attribution line on
the splash and stayed credited in the README) -- see `CHANGELOG.md`
[Unreleased] and PR #53. Everything below is still Followup/Folloup and
needs its own pass, deliberately deferred rather than done as a drive-by:

- **GitHub repo**: `mach1na/folloup` -> a new name (`chroninkle`?). Update
  the repo description too (`"A Folloup port for SeeedStudio's Sticky"` is
  already stale -- Sticky isn't even the current target). Repoint the local
  `origin` remote explicitly rather than relying on GitHub's redirect.
- **ESP-IDF project name**: `CMakeLists.txt:7` -- `project(folloup_sticky)`.
  This is what shows up as the app name in build output and the `.bin`/`.elf`
  filenames.
- **Kconfig namespace**: 14 `CONFIG_FOLLOWUP_*` symbols (Wi-Fi AP
  prefix/SSID/password, time sync defaults, default timezone, Gemini API
  key, auto-sleep timeouts, todo-archive days, text-reader folder) across
  `main/Kconfig.projbuild`, `sdkconfig.defaults`, and every `.cpp` that reads
  them. This is the most invasive single piece -- renaming it means updating
  every reference plus anyone's local `sdkconfig`, so it wants a dedicated
  branch and a real build+flash test, not folded into another change.
- **Source comments/log strings**: ~53 files under `main/`/`components/`
  (excluding generated files) mention "Followup"/"Folloup", including the
  onboarding carousel's first slide ("Welcome to Followup") and the startup
  log line (`"Followup firmware version %s"` in `app_shell.cpp`). The device's
  Wi-Fi setup hotspot also still broadcasts as `Followup-XXXXXX`
  (`CONFIG_FOLLOWUP_WIFI_AP_PREFIX="Followup"`) until the Kconfig rename
  above lands -- `docs/user-manual.md` calls this out explicitly rather than
  describing a name the device doesn't actually broadcast yet.
- **Internal technical docs**: `docs/app-architecture.md`,
  `docs/gemini-service.md`, `docs/auto-sleep.md`, `docs/asset-generation.md`,
  `docs/versioning.md`, `docs/waveshare-epaper-hardware-spec.md` all describe
  the product as Followup and reference the `CONFIG_FOLLOWUP_*`/`kFollowupLogo`
  symbols by their real (current) names -- rename these alongside the code
  they describe, not before, so they don't end up describing symbols that
  don't exist yet.
- **`webserver/`** (setup portal): page title/copy and `package.json` name
  still say Followup.

Do the Kconfig/CMake/source-comment pass as its own branch with a full
build+flash verification before merging, since it touches identifiers other
code and anyone's saved `sdkconfig` depend on.

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
- How this interacts with the still-open Followup -> Chroninkle rename above
  — worth sequencing so the rewrite doesn't have to touch both naming and
  visual design churn at once.

## Change the boot-up sound

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

