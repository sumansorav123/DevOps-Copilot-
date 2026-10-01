from fastapi import (
    APIRouter,
    HTTPException,
)

from app.models.schemas import (
    InvestigationRequest
)
from app.services.investigation_service import run_investigation


router = APIRouter(
    prefix="/api/investigation",
    tags=["Investigation"],
)


@router.post("")
def investigate(
    request: InvestigationRequest
):

    try:

        incident, result = run_investigation(
            request.incident_id,
            analysis_mode=request.analysis_mode,
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