# Architecture

## Product surface

```
Participant
   |
   +-- 004 Future Me
   |
   +-- 005 Character Studio
   |
   +-- Shared Report
   |
   +-- Local Admin (prototype)
```

## Shared conceptual pipeline

```
Raw user-authored data
        |
        v
Human profile / memory
        |
        +-------------------+
        |                   |
        v                   v
Future persona        Created persona
   (004)                  (005)
        |                   |
        +---------+---------+
                  v
             Conversation
                  |
                  v
            Analysis report
```

## Browser MVP

The current implementation is deliberately build-free:

- `index.html`
- `styles.css`
- `app.js`

Persistence is localStorage and generation calls an OpenAI-compatible API directly from the browser.

## Production target

```
Web client
   |
   v
Local/remote API gateway
   |
   +-- Auth / study permissions
   +-- User & consent service
   +-- Profile / memory service
   +-- Persona service
   +-- Conversation service
   +-- Analysis / report service
   +-- Provider adapters
          +-- text LLM
          +-- image model
          +-- optional ASR/TTS
```

The provider adapter remains OpenAI-compatible so a local FreeLLM endpoint can be used without coupling the product logic to one model vendor.
