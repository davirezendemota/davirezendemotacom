from datetime import datetime
from typing import Optional

from sqlmodel import Field

from core.BaseModel import BaseModel


class Article(BaseModel, table=True):
    __tablename__ = "article"

    slug: str = Field(unique=True, index=True)
    title: str
    published_at: datetime
    summary: Optional[str] = Field(default=None, nullable=True)
