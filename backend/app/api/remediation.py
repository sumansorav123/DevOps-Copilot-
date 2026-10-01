from datetime import datetime, timezone

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
    get_deployments,
    record_incident_event,
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

    approval_status = incident.get("approval", {}).get("status")
    if approval_status != "approved":

        return {

            "success": False,

            "status":
                "approval_rejected"
                if approval_status == "rejected"
                else "approval_required",

            "message":
                "Remediation was rejected by a human approver."
                if approval_status == "rejected"
                else "Human approval is required "
                "before remediation.",
        }


    action = request.action.lower()
    recommended = incident.get("recommendation", {}).get("recommended_action", {})
    if action != recommended.get("action"):
        raise HTTPException(
            status_code=409,
            detail="Requested remediation does not match the approved recommendation.",
        )

    if incident.get("remediation", {}).get("status") == "completed":
        raise HTTPException(status_code=409, detail="Remediation has already completed")


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
            deployments = get_deployments(incident["service"])
            latest = max(deployments, key=lambda item: item.get("deployed_at", "")) if deployments else {}
            completed_at = datetime.now(timezone.utc).isoformat()
            result_state = {
                "status": "completed",
                "action": "restart",
                "from_version": latest.get("version"),
                "to_version": latest.get("version"),
                "started_at": completed_at,
                "completed_at": completed_at,
            }
            update_incident(request.incident_id, remediation=result_state, status="verifying")
            record_incident_event(request.incident_id, "restart_completed", "Simulated service restart completed.", "remediation_service")

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
            deployments = get_deployments(incident["service"])
            latest = max(deployments, key=lambda item: item.get("deployed_at", "")) if deployments else {}
            completed_at = datetime.now(timezone.utc).isoformat()
            result_state = {
                "status": "completed",
                "action": "scale",
                "from_version": latest.get("version"),
                "to_version": latest.get("version"),
                "started_at": completed_at,
                "completed_at": completed_at,
            }
            update_incident(request.incident_id, remediation=result_state, status="verifying")
            record_incident_event(request.incident_id, "scale_completed", "Simulated service scaling completed.", "remediation_service")

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

        else:

            raise HTTPException(

                status_code=400,

                detail=(
                    "Unsupported action. "
                    "Use rollback, restart, "
                    "or scale."
                ),
            )


        # --------------------------------------------------
        # Verification
        # --------------------------------------------------

        verification = verify_incident(
            request.incident_id
        )
        updated_incident = get_incident(request.incident_id)


        return {

            "success": True,

            "data": {

                **result,

                "remediation": updated_incident.get("remediation"),

                "incident_status": updated_incident.get("status"),

                "verification":
                    verification,
            },
        }


    except ValueError as error:

        raise HTTPException(

            status_code=400,

            detail=str(error),
        )