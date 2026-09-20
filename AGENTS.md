# AGENTS.md

## Mission

AI-Uni contains two focused browser-first AI experiences:

- **004 Future Me** — a possible future self, not a prediction.
- **005 Character Studio** — user-created original AI characters.

The repository also owns their shared participant identity, storage, provider settings, analysis/report layer, and local admin prototype.

## Read before editing

1. `README.md`
2. `STATUS.md`
3. `DECISIONS.md`
4. `TODO.md`
5. `docs/ARCHITECTURE.md`
6. module-native README/code under `apps/`
7. `.github/workflows/check.yml`

Git is the durable source of truth. Handoff files summarize current state; they do not replace product/data contracts.

## Non-negotiable boundaries

- 004 produces a **possible** future self; never frame it as deterministic prediction.
- 005 is creation-first: users define whom they want to create rather than being forced into preset characters.
- Fictional character content must never be treated as autobiographical, trauma, psychosis-like, or other clinical evidence about the participant.
- Psychological output is reflective/research-oriented and non-diagnostic.
- Browser localStorage/admin UI are prototype infrastructure, not production authorization/security.
- Do not store upstream API keys in browser storage when proxy mode is being used to avoid that.
- 004/005 shared data must remain participant-scoped.
- Keep the old life-simulation / AI-Town loop out of this repository unless scope is deliberately reopened.
- Repository-facing identity is **CochraneK**.

## Validation

Current CI is intentionally minimal and checks syntax:

```bash
node --check app.js
python -m py_compile proxy/server.py
```

For product changes, also run the app locally:

```bash
python -m http.server 8080
```

Then exercise the affected 004/005 flow manually. Until browser/runtime tests are added, do not overstate CI coverage.

## Bounded work / checkpoint rule

1. Read the affected module and shared contracts.
2. Change implementation/canonical docs first.
3. Run syntax checks plus the affected local flow.
4. Update `STATUS.md` if capability/blocker state changed.
5. Update `TODO.md` when work is completed/re-scoped.
6. Append material product/data/privacy choices to `DECISIONS.md`.
7. Update `HANDOFF.md` when the immediate next action changes.
8. Commit before switching project/module/agent.

## Owner / external gates

Do not auto-decide production authentication architecture, research consent/ethics, publication of sensitive user data, diagnostic claims, or destructive repository history changes.
