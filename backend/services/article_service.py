from datetime import datetime
from pathlib import Path
from typing import List, Optional

import frontmatter
from sqlmodel import Session

from database.engine import engine
from dtos.article_dto import ArticleDetailResponse, ArticleResponse
from libraries.env import get_settings
from models.article import Article
from repositories.article_repository import ArticleRepository


def _storage_path() -> Path:
    settings = get_settings()
    if settings.ARTICLES_STORAGE_PATH:
        return Path(settings.ARTICLES_STORAGE_PATH)
    return Path(__file__).resolve().parent.parent / "storage" / "articles"


def _read_content(slug: str) -> Optional[str]:
    path = _storage_path() / f"{slug}.md"
    if not path.exists():
        return None
    try:
        post = frontmatter.load(path)
        return post.content
    except Exception:
        return None


def list_articles(session: Session, skip: int = 0, limit: int = 100) -> List[ArticleResponse]:
    repo = ArticleRepository(session)
    articles = repo.list_all_ordered(skip=skip, limit=limit)
    return [ArticleResponse.model_validate(a) for a in articles]


def get_article_by_slug(session: Session, slug: str) -> Optional[ArticleDetailResponse]:
    repo = ArticleRepository(session)
    article = repo.get_by_slug(slug)
    if not article:
        return None
    content = _read_content(slug)
    if content is None:
        content = ""
    data = ArticleResponse.model_validate(article).model_dump()
    data["content"] = content
    return ArticleDetailResponse(**data)


def sync_articles_from_storage() -> None:
    storage = _storage_path()
    if not storage.exists():
        return
    with Session(engine) as session:
        repo = ArticleRepository(session)
        for path in storage.glob("*.md"):
            slug = path.stem
            try:
                post = frontmatter.load(path)
                meta = post.metadata
                title = meta.get("title", slug)
                date_val = meta.get("date")
                if isinstance(date_val, datetime):
                    published_at = date_val
                elif isinstance(date_val, str):
                    published_at = datetime.fromisoformat(date_val.replace("Z", "+00:00"))
                else:
                    published_at = datetime.utcnow()
                summary = meta.get("summary") or None
                existing = repo.get_by_slug_for_upsert(slug)
                if existing:
                    existing.title = title
                    existing.published_at = published_at
                    existing.summary = summary
                    existing.updated_at = datetime.utcnow()
                    session.add(existing)
                else:
                    article = Article(
                        slug=slug,
                        title=title,
                        published_at=published_at,
                        summary=summary,
                    )
                    session.add(article)
            except Exception:
                continue
        session.commit()
