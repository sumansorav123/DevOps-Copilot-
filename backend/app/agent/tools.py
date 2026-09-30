from typing import Any, Dict

from app.services.incident_service import (
    get_incident,
    get_logs,
    get_metrics,
    get_deployments,
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

    return {

        "incident": incident,

        "logs": get_logs(
            incident_id
        ),

        "metrics": get_metrics(
            incident["service"]
        ),

        "deployments": get_deployments(
            incident["service"]
        ),
    }