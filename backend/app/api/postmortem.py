from fastapi import (
    APIRouter,
    HTTPException,
)

from app.models.schemas import (
    PostmortemRequest
)

from app.services.postmortem_service import (
    generate_postmortem
)


router = APIRouter(
    prefix="/api/postmortem",
    tags=["Postmortem"],
)


@router.post("")
def postmortem(
    request: PostmortemRequest
):

    try:

        result = generate_postmortem(
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