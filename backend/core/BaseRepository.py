from datetime import datetime
from typing import Generic, List, Optional, Type, TypeVar

from sqlmodel import Session, select

from core.BaseModel import BaseModel

ModelT = TypeVar("ModelT", bound=BaseModel)


class BaseRepository(Generic[ModelT]):
    def __init__(self, model: Type[ModelT], session: Session):
        self.model = model
        self.session = session

    def get_by_id(self, id: int) -> Optional[ModelT]:
        statement = select(self.model).where(
            self.model.id == id,
            self.model.deleted_at.is_(None),
        )
        return self.session.exec(statement).first()

    def list_all(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> List[ModelT]:
        statement = (
            select(self.model)
            .where(self.model.deleted_at.is_(None))
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.exec(statement).all())

    def create(self, entity: ModelT) -> ModelT:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def update(self, entity: ModelT) -> ModelT:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def delete(self, entity: ModelT) -> None:
        entity.deleted_at = entity.deleted_at or datetime.utcnow()
        self.session.add(entity)
        self.session.commit()
