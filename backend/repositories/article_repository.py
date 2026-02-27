from typing import List, Optional

from sqlmodel import select

from core.BaseRepository import BaseRepository
from models.article import Article


class ArticleRepository(BaseRepository[Article]):
    def __init__(self, session):
        super().__init__(Article, session)

    def get_by_slug(self, slug: str) -> Optional[Article]:
        statement = select(Article).where(
            Article.slug == slug,
            Article.deleted_at.is_(None),
        )
        return self.session.exec(statement).first()

    def list_all_ordered(self, skip: int = 0, limit: int = 100) -> List[Article]:
        statement = (
            select(Article)
            .where(Article.deleted_at.is_(None))
            .order_by(Article.published_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.exec(statement).all())

    def get_by_slug_for_upsert(self, slug: str) -> Optional[Article]:
        statement = select(Article).where(Article.slug == slug)
        return self.session.exec(statement).first()
