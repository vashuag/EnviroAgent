from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import goals, agent, webhooks, auth, integrations
from services.db import init_pool, close_pool, test_connection, get_table_names


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_pool()
    yield
    close_pool()


app = FastAPI(
    title="EnviroAgent API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://enviroagent.org",
        "https://www.enviroagent.org",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(goals.router, prefix="/api/v1")
app.include_router(agent.router, prefix="/api/v1")
app.include_router(integrations.router, prefix="/api/v1")
app.include_router(webhooks.router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
def health_db():
    if test_connection():
        return {"status": "ok", "database": "connected"}
    return {"status": "ok", "database": "error", "detail": "could not reach database"}


@app.get("/health/tables")
def health_tables():
    try:
        tables = get_table_names()
        return {"status": "ok", "tables": tables}
    except Exception as exc:
        return {"status": "ok", "tables": [], "detail": str(exc)}
