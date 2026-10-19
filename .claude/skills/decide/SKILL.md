---
name: decide
description: Log a settled decision for imkishore.in to docs/DECISIONS.md. Use when Kishore says "let's go with", "decided", "lock that in", "log the decision" or runs /decide.
---

Record a decision Kishore actually made. Use the text after `/decide` if there is any, otherwise the decision we just reached.

1. Only log decisions Kishore made or clearly accepted. A suggestion from Claude is not a decision. If unsure, quote the wording back and ask first.
2. Append to `docs/DECISIONS.md`: `### YYYY-MM-DD: short title`, then what was decided, then `Why:` in one or two lines.
3. If it replaces an earlier decision, add `Replaces: <date and title>` to the new entry and append `(superseded YYYY-MM-DD)` to the old entry's title line only. Touch nothing else in the old entry.
4. If it changes a hard rule, the design direction or the fonts section in `CLAUDE.md`, say so and ask before editing `CLAUDE.md`.
5. If it settles something listed in `docs/OPEN-ITEMS.md`, tick or update that item.
6. Follow the writing rules in `CLAUDE.md`. Reply with one line saying what was logged.
