from fastapi import (
    APIRouter,
    HTTPException,
)

from app.models.schemas import (
    RemediationRequest
)

from app.services.rollback_service import (
    rollback_incident
)

from app.services.verification_service import (
    verify_incident
)

from app.services.incident_service import (
    get_incident,
    update_incident,
)


router = APIRouter(
    prefix="/api/remediation",
    tags=["Remediation"],
)


@router.post("")
def remediate(
    request: RemediationRequest
):

    incident = get_incident(
        request.incident_id
    )

    if not incident:

        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )


    # --------------------------------------------------
    # Human Approval
    # --------------------------------------------------

    if not request.approved:

        return {

            "success": False,

            "status":
                "approval_required",

            "message":
                "Human approval is required "
                "before remediation.",
        }


    action = request.action.lower()


    try:

        # --------------------------------------------------
        # Rollback
        # --------------------------------------------------

        if action == "rollback":

            result = rollback_incident(
                request.incident_id
            )


        # --------------------------------------------------
        # Restart
        # --------------------------------------------------

        elif action == "restart":

            update_incident(

                request.incident_id,

                status="remediating",
            )

            result = {

                "action":
                    "restart",

                "message":
                    "Service restart "
                    "simulated successfully.",
            }


        # --------------------------------------------------
        # Scale
        # --------------------------------------------------

        elif action == "scale":

            update_incident(

                request.incident_id,

                status="remediating",
            )

            result = {

                "action":
                    "scale",

                "message":
                    "Service scaling action "
                    "simulated successfully.",
            }


        # --------------------------------------------------
        # None
        # --------------------------------------------------

        elif action == "none":

            result = {

                "action":
                    "none",

                "message":
                    "No remediation "
                    "action executed.",
            }


        else:

            raise HTTPException(

                status_code=400,

                detail=(
                    "Unsupported action. "
                    "Use rollback, restart, "
                    "scale, or none."
                ),
            )


        # --------------------------------------------------
        # Verification
        # --------------------------------------------------

        verification = verify_incident(
            request.incident_id
        )


        update_incident(

            request.incident_id,

            status=(
                "resolved"
                if verification["verified"]
                else "investigating"
            ),
        )


        return {

            "success": True,

            "data": {

                **result,

                "verification":
                    verification,
            },
        }


    except ValueError as error:

        raise HTTPException(

            status_code=400,

            detail=str(error),
        )