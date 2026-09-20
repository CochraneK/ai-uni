"""Optional local proxy for AI-Uni.

Use this when the browser cannot call your FreeLLM/OpenAI-compatible endpoint because of CORS,
or when you do not want the upstream API key stored in browser localStorage.

Run:
    pip install -r proxy/requirements.txt
    UPSTREAM_API_BASE=http://127.0.0.1:8000/v1 \
    UPSTREAM_API_KEY=... \
    uvicorn proxy.server:app --host 127.0.0.1 --port 8787

Then set AI-Uni API Base to http://127.0.0.1:8787/v1 and leave browser API Key blank.
"""
import os

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

UPSTREAM = os.getenv("UPSTREAM_API_BASE", "http://127.0.0.1:8000/v1").rstrip("/")
UPSTREAM_KEY = os.getenv("UPSTREAM_API_KEY", "")

app = FastAPI(title="AI-Uni local model proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8080",
        "http://localhost:8080",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"ok": True, "upstream": UPSTREAM}


async def forward(path: str, request: Request) -> Response:
    headers = {"content-type": "application/json"}
    auth = request.headers.get("authorization")
    if UPSTREAM_KEY:
        headers["authorization"] = f"Bearer {UPSTREAM_KEY}"
    elif auth:
        headers["authorization"] = auth

    body = await request.body()
    async with httpx.AsyncClient(timeout=180) as client:
        upstream = await client.post(f"{UPSTREAM}/{path}", content=body, headers=headers)

    passthrough = {}
    if upstream.headers.get("content-type"):
        passthrough["content-type"] = upstream.headers["content-type"]
    return Response(content=upstream.content, status_code=upstream.status_code, headers=passthrough)


@app.post("/v1/chat/completions")
async def chat_completions(request: Request):
    return await forward("chat/completions", request)


@app.post("/v1/images/generations")
async def image_generations(request: Request):
    return await forward("images/generations", request)
