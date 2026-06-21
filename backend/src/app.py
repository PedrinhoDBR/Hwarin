from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings
from src.db.bootstrap import init_database
from src.routes import auth, chapter, follows, ratings, story, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_database()
    yield


def create_app() -> FastAPI:
    api = FastAPI(
        title="Hwarin API",
        description="API para gerenciamento de usuarios, historias, capitulos e interacoes.",
        version="1.0.0",
        lifespan=lifespan,
    )

    api.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    api.include_router(users.router, prefix="/api/users", tags=["users"])
    api.include_router(story.router, prefix="/api/stories", tags=["stories"])
    api.include_router(chapter.router, prefix="/api/chapters", tags=["chapters"])
    api.include_router(follows.router, prefix="/api/follows", tags=["follows"])
    api.include_router(ratings.router, prefix="/api/ratings", tags=["ratings"])

    @api.get("/", tags=["health"])
    def root():
        return {"message": "Hwarin API is running"}

    return api


app = create_app()


if __name__ == "__main__":
    uvicorn.run("src.app:app", host="0.0.0.0", port=3000, reload=True)
