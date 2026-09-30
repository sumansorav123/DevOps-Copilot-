from fastapi import APIRouter, HTTPException
from app.models.schemas import VerificationResponse, InvestigationRequest
from app.services.incident_service import get_incident_by_id
from app.services.verification_service import verify_incident

router = APIRouter(prefix="/api/verification", tags=["Verification"])


@router.post("/", response_model=VerificationResponse)
def verify(request: InvestigationRequest):
    incident = get_incident_by_id(request.incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return verify_incident(incident)


@router.get("/{incident_id}", response_model=VerificationResponse)
def get_verification(incident_id: str):
    incident = get_incident_by_id(incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    verification = incident.get("verification", {})
    return {
        "incident": incident,
        "status": verification.get("status", "not_started"),
        "message": "Verification has not run yet." if verification.get("status") == "not_started" else "Verification state loaded.",
        "metrics_before": verification.get("metrics_before"),
        "metrics_after": verification.get("metrics_after"),
        "comparison": verification.get("comparison", {}),
    }
