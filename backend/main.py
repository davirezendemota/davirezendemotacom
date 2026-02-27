from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.article_controller import router as articles_router
from services.article_service import sync_articles_from_storage


@asynccontextmanager
async def lifespan(app: FastAPI):
    sync_articles_from_storage()
    yield


app = FastAPI(
    title="Davi Rezende API",
    root_path="",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(articles_router, prefix="/articles", tags=["Articles"])


@app.get("/health")
def health():
    return {"status": "ok"}
