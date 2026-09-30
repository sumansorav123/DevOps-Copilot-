from fastapi import (
    APIRouter,
    HTTPException,
)

from app.agent.incident_agent import (
    investigate_incident
)

from app.models.schemas import (
    InvestigationRequest
)


router = APIRouter(
    prefix="/api/investigation",
    tags=["Investigation"],
)


@router.post("")
def investigate(
    request: InvestigationRequest
):

    try:

        result = investigate_incident(
            request.incident_id
        )

        return {

            "success": True,

            "data":
                result,
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error),
        )