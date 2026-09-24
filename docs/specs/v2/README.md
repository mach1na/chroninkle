# Chroninkle V2 specs

V2 is a graphical/UX rework of the on-device firmware: an icon-based
interface (replacing today's text/"optimistic phrase" copy), a new
hand-crafted pixel-art logo and icon set, a new default font, a rethought
Notes/Todos browsing format, a redesigned footer, history-aware back
navigation, a rework-or-deprecation of the FollowUp feature, deprecation of
the sticky-note overlay, and a more intuitive topic-tagging flow. Per
`docs/versioning.md` this is a MAJOR release (`2.0.0`).

## Workflow

V2 is spec-driven: each feature area below gets a written spec, using
[`_template.md`](_template.md), that reaches an agreed **Ready** state
*before* its implementation branch starts — not designed while coding. This
is meant to cut down on back-and-forth during implementation.

Specs are written and refined on `v2-dev` or its feature branches, not on
`main`. Once a spec is `Ready`, its implementation gets its own branch off
`v2-dev` (per CLAUDE.md's per-item-branch rule — `v2-dev` is a shared base,
not a place to stack unrelated work directly) and merges back into
`v2-dev`. When V2 is feature-complete and tested, `v2-dev` merges into
`main` as the `2.0.0` release; `main` keeps taking v1 patch/minor fixes
independently in the meantime.

**Status legend:**
- `Draft` — stub only, needs Craig's design input
- `Ready` — agreed and filled in, implementable
- `In Progress` — implementation branch underway
- `Done` — merged into `v2-dev`

## Specs

| Spec | Status |
| --- | --- |
| [Home screen](home-screen.md) | Draft |
| [Visual assets (logo, icons, font)](visual-assets.md) | Draft |
| [Notes/Todos format](notes-todos-format.md) | Draft |
| [Footer redesign](footer-redesign.md) | Draft |
| [Back navigation](back-navigation.md) | Draft |
| [FollowUp rework](followup-rework.md) | Draft |
| [Stickies deprecation](stickies-deprecation.md) | Draft |
| [Topics flow](topics-flow.md) | Draft |

## Design resources

Visual assets (logo, icons, font) are Craig's deliverables, produced outside
this repo's git history. See `design/v2-resource-manifest.md` (gitignored,
repo root) for the checklist.
