from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.models.schemas import IncidentApprovalRequest, SimulateIncidentRequest
from app.services.incident_service import (
    create_incident,
    get_dashboard_summary,
    get_deployments,
    get_incident,
    get_incidents,
    get_logs,
    get_incident_context,
    get_metrics,
    canonical_service_name,
    record_incident_event,
    update_incident,
)

router = APIRouter(
    prefix="/api/incidents",
    tags=["Incidents"],
)


# --------------------------------------------------
# All Incidents
# --------------------------------------------------

@router.get("")
def list_incidents():
    return {
        "success": True,
        "data": get_incidents(),
    }


@router.post("/simulate")
def simulate_incident(request: SimulateIncidentRequest):
    if (
        request.scenario == "Memory Usage Spike"
        and canonical_service_name(request.service) != "user-service"
    ):
        raise HTTPException(
            status_code=422,
            detail="Memory Usage Spike is available for User Service fixture data.",
        )
    if (
        request.scenario == "HTTP 500 Error Spike"
        and canonical_service_name(request.service) != "payment-service"
    ):
        raise HTTPException(
            status_code=422,
            detail="HTTP 500 Error Spike is available for Payment API fixture data.",
        )

    incident = create_incident(
        scenario=request.scenario,
        service=request.service,
        description=request.description,
        severity=request.severity,
        recovery_profile=request.recovery_profile,
    )
    return {"success": True, "data": incident}


# --------------------------------------------------
# Dashboard
# --------------------------------------------------

@router.get("/dashboard")
def dashboard():
    return {
        "success": True,
        "data": get_dashboard_summary(),
    }


# --------------------------------------------------
# Incident Details
# --------------------------------------------------

@router.get("/{incident_id}")
def incident_details(incident_id: str):
    incident = get_incident(incident_id)

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    return {
        "success": True,
        "data": incident,
    }


@router.post("/{incident_id}/approval")
def incident_approval(incident_id: str, request: IncidentApprovalRequest):
    incident = get_incident(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    decision = request.decision.lower()
    if decision not in {"approved", "rejected"}:
        raise HTTPException(status_code=400, detail="Decision must be approved or rejected")

    existing_decision = incident.get("approval", {}).get("status", "pending")
    if existing_decision in {"approved", "rejected"}:
        if existing_decision != decision:
            raise HTTPException(status_code=409, detail="An approval decision has already been recorded")
        return {
            "success": True,
            "data": {
                "incident_id": incident_id,
                "decision": existing_decision,
                "approved_by": incident["approval"].get("actor"),
                "timestamp": incident["approval"].get("decided_at"),
            },
        }

    if incident.get("rollback", {}).get("status") == "completed":
        raise HTTPException(status_code=409, detail="Approval cannot change after remediation")

    decided_at = datetime.now(timezone.utc).isoformat()
    incident.update({
        "status": decision,
        "approval": {
            "status": decision,
            "actor": request.actor,
            "decided_at": decided_at,
            "comment": request.comment,
        },
        "updated_at": decided_at,
    })
    update_incident(incident_id, **incident)
    record_incident_event(
        incident_id,
        f"approval_{decision}",
        request.comment or f"Human decision: {decision}.",
        request.actor,
    )

    return {
        "success": True,
        "data": {
            "incident_id": incident_id,
            "decision": decision,
            "approved_by": request.actor,
            "timestamp": incident["approval"]["decided_at"],
        },
    }


@router.get("/{incident_id}/audit")
def incident_audit(incident_id: str):
    incident = get_incident(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    audit_log = incident.get("audit_log") or [{
        "event": "incident_created",
        "timestamp": incident.get("created_at"),
        "detail": incident.get("description"),
    }]
    return {"success": True, "data": audit_log}


# --------------------------------------------------
# Incident Logs
# --------------------------------------------------

@router.get("/{incident_id}/logs")
def incident_logs(
    incident_id: str
):
    incident = get_incident(incident_id)
    if not incident:

        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )


    return {

        "success": True,

        "data":
            get_incident_context(incident)["logs"],
    }


# --------------------------------------------------
# Incident Metrics
# --------------------------------------------------

@router.get("/{incident_id}/metrics")
def incident_metrics(
    incident_id: str
):

    incident = get_incident(
        incident_id
    )

    if not incident:

        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )


    return {

        "success": True,

        "data":
            get_incident_context(incident)["metrics"],
    }


# --------------------------------------------------
# Incident Deployments
# --------------------------------------------------

@router.get("/{incident_id}/deployments")
def incident_deployments(
    incident_id: str
):

    incident = get_incident(
        incident_id
    )

    if not incident:

        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )


    return {

        "success": True,

        "data":
            get_incident_context(incident)["deployments"],
    }