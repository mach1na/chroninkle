# Chroninkle

A voice-first thought-capture notebook: press and hold to record a thought, tag it, and have it transcribed, summarized and kept organized on an e-paper screen.

## Language

### Capture

**Entry**:
One captured thought: its recording, tag, transcript and topics together.
_Avoid_: Note (as the generic word), take, thought, item

**Recording**:
The audio clip of an Entry, nothing more.
_Avoid_: Entry (when you mean only the audio), clip

**Tag**:
The classification chosen after recording: exactly one of Note, To-do or Idea.
_Avoid_: Category, type

**Note**:
The Tag for a general thought. The Notes list shows Entries tagged Note or Idea.
_Avoid_: Entry (as the generic word)

**To-do**:
The Tag for something to do, and the name of the list that shows them.
_Avoid_: Task, Todo

**Idea**:
The Tag for something to mull over later.

**Transcript**:
The text of one Recording, produced by Gemini.
_Avoid_: Summary (a Transcript is never a summary)

**Record menu action**:
A post-recording menu option that does not produce a tagged Entry: Topic (creates a new Topic from what was said) or Discard (throws the Recording away).
_Avoid_: Topic tag, Discard tag

### Organization

**Topic**:
A user-defined label, such as a project name, attached to any Entry independently of its Tag.
_Avoid_: Project, category

**Summary**:
A generated overview of all the Entries tagged with one Topic. Never produced for a single Entry.
_Avoid_: Transcript (the text of one Recording)

### Deprecated

**Follow-up**:
A flag marking an Entry to come back to. Being deprecated in V2; do not build new design on it.

### Lineage

**Sticky**:
The original Seeed reTerminal Sticky hardware this project was first ported from. Not a feature of Chroninkle.
_Avoid_: Sticky note, stickies (the removed overlay)

**Followup**:
The product's former name, before Chroninkle.
_Avoid_: Using it for the product; use Chroninkle
