---
'@lion/button': minor
---

- restructure hierarchy for `lion-button` package:

  - LionButtonBase (a clean fundament, **use outside forms**)
  - LionButtonReset (logic for. submit and reset events, but without implicit form submission logic: **use for reset buttons**)
  - LionButton (full featured button: **use for submit buttons and buttons with dynamic types**)

- fixed axe criterium for LionButton (which contained a native button to support form submission)
