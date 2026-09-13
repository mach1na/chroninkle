# Changelog

All notable changes to Followup are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows
[Semantic Versioning](docs/versioning.md). History prior to 0.2.0 is available
via `git log`, not backfilled here.

## [Unreleased]

### Changed

- The boot splash now leads with the new **Chroninkle** name and mark, in a
  stacked lockup (`assets/logos/chroninkle-logo-stacked.png`,
  `EmbeddedLogoId::kChroninkleLogoStacked`), reflecting the project's rename
  from Followup. A horizontal lockup (`chroninkle-logo.png`) and an
  icon-only mark (`chroninkle-icon.png`) are generated alongside it for
  future use. The previous Folloup logo and the ALXV Labs logo it launched
  under move to a smaller "Based on" attribution line at the bottom of the
  same splash (75% of their old splash size) rather than disappearing
  (`display_service::DrawSplashScreen`). No other Followup branding changes
  yet — this is the first step of the rename.
- The Record button's quick tap is now a dedicated **Back** button instead of
  a second select/confirm button: it exits an entered list/scroll/control
  (`button_service::IsBackGesture`). The rocker-middle FN button is now the
  sole select/confirm control (`button_service::IsSelectButton`). Holding the
  rocker's down-tilt no longer exits an entered control either — that hold is
  freed up for continuous scrolling within one, reserved for later. Recording
  (press-and-hold the Record button) is unaffected. Updated the onboarding
  carousel's text and artwork (`assets/images/slide2.png`,
  `assets/images/slide3.png`) to match.

## [0.4.0] - 2026-09-13

### Added

- On-device `.txt` reader: a new "Books" item on the Home menu browses `.txt`
  files in a configurable SD card folder (`CONFIG_FOLLOWUP_TEXT_READER_FOLDER`,
  default `books`) and opens a paginated reading view. Each book remembers its
  last-read page position in a `<filename>.pos` sidecar next to it on the SD
  card. Page turns (UP/DOWN tilt) use a partial refresh; long-press DOWN
  returns to the book list.

## [0.3.1] - 2026-09-13

### Fixed

- Holding PWR to power the device back on after a manual shutdown sometimes
  didn't register on the first attempt. Shortened the AXP2101's PWRON
  power-on hold requirement from 1s to 512ms
  (`Axp2101::PowerKeyPressOnTime::k512Ms`), reducing how much uninterrupted
  contact a single press needs against physical key bounce. Confirmed
  reliable on-device across repeated shutdown/power-on cycles.

## [0.3.0] - 2026-09-11

### Changed

- Reordered the Home screen's main menu to Follow up, Todos, Notes, Topics
  (was Follow up, Topics, Notes, Todos).

## [0.2.0] - 2026-09-11

### Added

- Semantic versioning for the firmware: `version.txt` as the source of truth,
  a boot-time version log line, this changelog, and `docs/versioning.md`
  describing the workflow.

### Changed

- Baselined the starting version at 0.2.0 rather than 0.1.0, reflecting the
  substantial feature work already merged since this repo forked from
  `alxv2016/folloup-sticky` (topics, summarization, offline-transcription
  retry, settings redesign, and more — see `git log` for the full history).
