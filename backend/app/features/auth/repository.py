from uuid import UUID

from supabase import Client

from app.features.auth.models import CurrentOperator

OPERATOR_COLUMNS = "id"


class OperatorNotLinkedError(Exception):
    pass


class OperatorRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    def get_by_auth_user_id(self, auth_user_id: UUID) -> CurrentOperator:
        row = (
            self._client.table("operators")
            .select(OPERATOR_COLUMNS)
            .eq("auth_user_id", str(auth_user_id))
            .maybe_single()
            .execute()
            .data
        )
        if row is None:
            raise OperatorNotLinkedError

        return CurrentOperator.model_validate(row)
