from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    published_at: datetime
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ArticleDetailResponse(ArticleResponse):
    content: str
