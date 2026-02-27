from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from database.engine import get_session
from dtos.article_dto import ArticleDetailResponse, ArticleResponse
from services import article_service

router = APIRouter()


@router.get("", response_model=list[ArticleResponse])
def list_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    session: Session = Depends(get_session),
):
    return article_service.list_articles(session, skip=skip, limit=limit)


@router.get("/{slug}", response_model=ArticleDetailResponse)
def get_article(
    slug: str,
    session: Session = Depends(get_session),
):
    article = article_service.get_article_by_slug(session, slug)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("/sync")
def sync_articles():
    article_service.sync_articles_from_storage()
    return {"status": "ok"}
