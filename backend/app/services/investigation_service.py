from typing import Any, Dict, Tuple

from app.agent.incident_agent import investigate_incident
from app.services.incident_service import (
    get_incident,
    record_incident_event,
    update_incident,
)


def run_investigation(
    incident_or_id: Any,
    analysis_mode: str = "Evidence Based",
) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    incident_id = (
        incident_or_id.get("id")
        if isinstance(incident_or_id, dict)
        else str(incident_or_id)
    )
    incident = get_incident(incident_id)
    if incident is None:
        raise ValueError(f"Incident {incident_id} not found")
    if incident.get("recommendation") and incident.get("status") not in {"detected", "investigating"}:
        return incident, incident["recommendation"]

    result = investigate_incident(incident_id, analysis_mode=analysis_mode)
    update_incident(
        incident_id,
        recommendation=result,
        status="approval_pending",
    )
    record_incident_event(
        incident_id,
        "investigation_completed",
        f"Analysis completed with {result['confidence']:.0%} confidence.",
        "incident_agent",
    )
    return get_incident(incident_id), result
