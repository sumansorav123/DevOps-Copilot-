import json

from pathlib import Path
from typing import Any, Dict, List, Optional


DATA_DIR = Path(__file__).resolve().parents[2] / "data"


# --------------------------------------------------
# JSON Helpers
# --------------------------------------------------

def load_json(filename: str):
    file_path = DATA_DIR / filename

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def save_json(filename: str, data):
    file_path = DATA_DIR / filename

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)


# --------------------------------------------------
# Incidents
# --------------------------------------------------

def get_incidents() -> List[Dict[str, Any]]:
    return load_json("incidents.json")


def get_incident(incident_id: str) -> Optional[Dict[str, Any]]:
    incidents = get_incidents()

    for incident in incidents:
        if incident["id"] == incident_id:
            return incident

    return None


def update_incident(
    incident_id: str,
    **updates
):
    incidents = get_incidents()

    for incident in incidents:

        if incident["id"] == incident_id:

            incident.update(updates)

            save_json(
                "incidents.json",
                incidents
            )

            return incident

    return None


# --------------------------------------------------
# Logs
# --------------------------------------------------

def get_logs(
    incident_id: Optional[str] = None
):
    logs = load_json("logs.json")

    if incident_id:

        return [
            log
            for log in logs
            if log.get("incident_id") == incident_id
        ]

    return logs


# --------------------------------------------------
# Metrics
# --------------------------------------------------

def get_metrics(
    service: Optional[str] = None
):
    metrics = load_json("metrics.json")

    if service:

        return [
            metric
            for metric in metrics
            if metric.get("service") == service
        ]

    return metrics


# --------------------------------------------------
# Deployments
# --------------------------------------------------

def get_deployments(
    service: Optional[str] = None
):
    deployments = load_json(
        "deployments.json"
    )

    if service:

        return [
            deployment
            for deployment in deployments
            if deployment.get("service") == service
        ]

    return deployments


# --------------------------------------------------
# Dashboard
# --------------------------------------------------

def get_dashboard_summary():

    incidents = get_incidents()

    active = [
        incident
        for incident in incidents
        if incident["status"]
        not in ("resolved", "closed")
    ]

    critical = [
        incident
        for incident in active
        if incident["severity"].lower()
        == "critical"
    ]

    services = set(
        incident["service"]
        for incident in active
    )

    return {
        "total_incidents": len(incidents),

        "active_incidents": len(active),

        "critical_incidents": len(critical),

        "resolved_incidents": len([
            incident
            for incident in incidents
            if incident["status"] == "resolved"
        ]),

        "services_affected": len(services),
    }