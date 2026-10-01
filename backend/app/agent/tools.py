from typing import Any, Dict

from app.services.incident_service import (
    get_incident,
    get_incident_context,
)


def fetch_incident_context(
    incident_id: str
) -> Dict[str, Any]:

    incident = get_incident(
        incident_id
    )

    if not incident:

        raise ValueError(
            f"Incident {incident_id} not found"
        )

    evidence = get_incident_context(incident)
    return {

        "incident": incident,

        **evidence,
    }