from fastapi import APIRouter, HTTPException

from app.models.schemas import InvestigationRequest, VerificationResponse
from app.services.incident_service import get_incident_by_id
from app.services.verification_service import verify_incident

router = APIRouter(prefix="/api/verification", tags=["Verification"])


@router.post("", response_model=VerificationResponse)
def verify(request: InvestigationRequest):
    incident = get_incident_by_id(request.incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")

    result = verify_incident(request.incident_id)
    incident = get_incident_by_id(request.incident_id)
    return {
        "incident": incident,
        "status": result.get("status", "failed"),
        "message": result.get("message", "Verification completed."),
        "metrics_before": result.get("metrics_before"),
        "metrics_after": result.get("metrics_after"),
        "comparison": result.get("comparison", {}),
    }


@router.get("/{incident_id}", response_model=VerificationResponse)
def get_verification(incident_id: str):
    incident = get_incident_by_id(incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")

    verification = incident.get("verification", {})
    if verification.get("status") in {"passed", "failed"}:
        return {
            "incident": incident,
            "status": verification["status"],
            "message": verification.get("message", "Verification completed."),
            "metrics_before": verification.get("metrics_before"),
            "metrics_after": verification.get("metrics_after"),
            "comparison": verification.get("comparison", {}),
        }

    return {
        "incident": incident,
        "status": verification.get("status", "not_started"),
        "message": verification.get("message", "Verification has not been run."),
        "metrics_before": verification.get("metrics_before"),
        "metrics_after": verification.get("metrics_after"),
        "comparison": verification.get("comparison", {}),
    }
