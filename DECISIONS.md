# DECISIONS

## D001 — Scope

AI-Uni contains only the shared platform plus:

- **004 Future Me**
- **005 Character Studio**

Life simulation, random life events, AI Town map/game loops, and autonomous NPC society simulation are out of scope.

## D002 — 004 framing

Future Me generates **possible future selves**, not deterministic forecasts.

## D003 — 005 creation model

005 is creation-first, not catalog-first. Users describe whom they want to create; AI helps complete the persona and generates an original image. Preset examples may inspire but must not become mandatory role choices.

## D004 — Shared data

004 and 005 share the same participant identity, storage layer, model configuration, analysis/report layer, and eventual admin backend.

## D005 — Model access

Text and image generation use a provider adapter compatible with OpenAI-style endpoints, including local FreeLLM deployments. Browser TTS is the default free speech output.

## D006 — Psychological analysis

Personality / strengths / limitations / self / relationships / growth can be summarized from user-authored data. Trauma-related and psychosis-like content must be presented as uncertain, evidence-linked signals only; character fiction must never be treated as user symptom evidence.

## D007 — Prototype vs production

The browser MVP uses localStorage for speed of iteration. Production research use requires authenticated server-side storage, access control, consent handling, auditability and export governance.


## D008 — Agent continuity

Git is the durable canonical project state. `AGENTS.md` and `HANDOFF.md` provide a cold-start path for another agent, while STATUS/DECISIONS/TODO remain the current state, frozen choices, and execution queue.

## D009 — CI claim boundary

The current GitHub workflow provides syntax checks for `app.js` and `proxy/server.py`. It must not be described as full product/runtime coverage until browser, storage, privacy, and interaction regression tests are added.

## D010 — Canonical identity

Repository-facing maintainer identity is **CochraneK**.
