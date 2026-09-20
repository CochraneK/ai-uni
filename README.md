# AI-Uni

> Two focused AI experiences for AI-Ques: **004 Future Me** and **005 Character Studio**.

AI-Uni is a lightweight, browser-first prototype for creating and talking with a possible future self, or creating an original AI character and chatting with it. It keeps user data locally by default and can connect to an OpenAI-compatible text/image endpoint such as a local FreeLLM API.

## Modules

### 004 · Future Me
- collect the user's current self, goals, values and important experiences
- generate a **possible future self** (not a prediction)
- optionally generate a future-self image
- chat with the future self
- browser TTS via `speechSynthesis`
- preserve conversations for later analysis

### 005 · Character Studio
- user starts from their own idea instead of choosing a preset character
- AI expands the idea into a structured character/persona
- optionally generate an original character image
- chat with the created character
- preserve character and conversation history

### Shared analysis
AI-Uni can synthesize saved user input and conversations into a structured reflection report covering personality patterns, strengths, limitations, self-model, relationship patterns, growth suggestions, and carefully worded **non-diagnostic** trauma-related / unusual-experience signals.

## Run

This first version is deliberately build-free:

1. clone/download the repository
2. serve the folder with any local HTTP server, e.g. `python -m http.server 8080`
3. open `http://localhost:8080`
4. open **Settings** and configure your OpenAI-compatible endpoint/model if you want AI generation

Without an API, the interface and local data flow still work, but AI-generation actions use local fallback content.

## Data & privacy

- Prototype data is stored in the current browser's `localStorage`.
- Multiple participant profiles are separated by participant code.
- The admin view is a **local research prototype**, not a secure production authorization boundary.
- Do not deploy sensitive research/clinical data publicly without replacing localStorage/admin controls with authenticated server-side storage and access control.
- Psychological outputs are signals for reflection/research support, not diagnosis.

## Project state

See [STATUS.md](STATUS.md), [DECISIONS.md](DECISIONS.md), and [TODO.md](TODO.md).

## Scope

AI-Uni intentionally does **not** contain the old life-simulation / AI-Town game loop. Those concerns belong elsewhere. This repository focuses on 004 and 005 plus the shared user, memory, analysis and admin shell.
