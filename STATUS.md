# STATUS

## Current milestone

**v0.1 browser MVP — active**

The repository was recreated from scratch on 2026-09-21. The old AI Town / life-simulation implementation is intentionally not part of the new codebase.

## Implemented

- unified browser app shell
- participant-code based local user separation
- 004 Future Me
  - current-self / experience / goal input
  - possible future persona generation
  - future-self chat
  - optional image generation through OpenAI-compatible endpoint
  - browser TTS
- 005 Character Studio
  - user-created character concept
  - AI-assisted structured persona creation
  - original character image generation
  - character chat
- shared local persistence
- shared report generation
- local admin overview and JSON export
- OpenAI-compatible text/image settings
- optional local proxy for browser CORS/key-isolation use cases
- basic syntax CI for browser JavaScript and proxy Python

## Important limitation

The current version is a **local/browser research prototype**. localStorage and the admin page are not production security boundaries.

## Next milestone

v0.2: secure server-backed user/admin separation, resume/profile flows, structured evidence-linked memory extraction, richer text mining, browser/runtime regression tests, and deployment/privacy checks.
