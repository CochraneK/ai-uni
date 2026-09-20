# Agent Handoff

## Current mission

Advance AI-Uni from a local browser MVP toward a research-usable 004/005 platform without losing its scope, privacy, evidence, or product boundaries.

## What exists now

- 004 Future Me:
  - current-self / experience / goal intake;
  - possible future-persona generation;
  - future-self chat;
  - optional image generation;
  - browser TTS.
- 005 Character Studio:
  - user-authored character concept;
  - AI-assisted structured persona;
  - optional original character image;
  - character chat.
- shared participant-code separation and local persistence;
- shared report/admin prototype;
- direct OpenAI-compatible browser API mode;
- optional local proxy mode for CORS/key-isolation use cases;
- syntax CI for browser JavaScript and proxy Python.

## Current limitations

- localStorage and local admin are not production authorization boundaries;
- no secure server-backed participant/admin identity layer yet;
- automated tests are currently syntax-level rather than browser/runtime behavior coverage;
- psychological analysis remains non-diagnostic and must keep user-authored vs fictional evidence separated.

## Immediate next actions

1. Build secure user/admin separation behind an authenticated server mode.
2. Add participant profile editing + resume-last-session.
3. Add explicit character library and memory edit/delete controls.
4. Add evidence-linked memory extraction and richer text-mining analysis.
5. Add browser/runtime/data/privacy regression tests beyond syntax-only CI.
6. Keep raw user evidence and derived analysis exportable separately.

## Validation

```bash
node --check app.js
python -m py_compile proxy/server.py
python -m http.server 8080
```

After starting the server, manually exercise the changed 004/005 path until automated browser tests exist.

## Canonical files

- `STATUS.md`
- `DECISIONS.md`
- `TODO.md`
- `docs/ARCHITECTURE.md`
- `schemas/`
- module-native `apps/004-future-me/` and `apps/005-character-studio/`
- `app.js` and `proxy/server.py`

## Do not

- do not reintroduce the old life-simulation/AI-Town scope by accident;
- do not treat fictional character content as participant clinical evidence;
- do not describe Future Me as prediction;
- do not mistake local admin/localStorage for secure research infrastructure;
- do not leave material project state only in chat.

## Session closeout

Update canonical implementation first, then STATUS/TODO/DECISIONS/HANDOFF as needed, validate the bounded work unit, and commit before another agent takes over.
