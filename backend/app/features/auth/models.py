from uuid import UUID

from pydantic import BaseModel


class AuthenticatedUser(BaseModel):
    id: UUID


class CurrentOperator(BaseModel):
    id: UUID
