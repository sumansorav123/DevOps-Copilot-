import json
import re
import os
import threading

from pathlib import Path
from typing import Any, Dict, List, Optional


DATA_DIR = Path(__file__).resolve().parents[2] / "data"
DATA_LOCK = threading.RLock()


SERVICE_ALIASES = {
    "payment api": "payment-service",
    "payments api": "payment-service",
    "payment-service": "payment-service",
    "api gateway": "api-gateway",
    "api-gateway": "api-gateway",
    "user service": "user-service",
    "user-service": "user-service",
}


def canonical_service_name(service: Optional[str]) -> Optional[str]:
    if service is None:
        return None

    normalized = service.strip().lower()
    if normalized in SERVICE_ALIASES:
        return SERVICE_ALIASES[normalized]

    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    return normalized.strip("-")


# --------------------------------------------------
# JSON Helpers
# --------------------------------------------------

def load_json(filename: str):
    file_path = DATA_DIR / filename

    with DATA_LOCK:
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)


def save_json(filename: str, data):
    with DATA_LOCK:
        file_path = DATA_DIR / filename
        temp_path = file_path.with_name(
            f".{file_path.name}.{os.getpid()}.{threading.get_ident()}.tmp"
        )

        with open(temp_path, "w", encoding="utf-8") as file:
            json.dump(data, file, indent=2)

        temp_path.replace(file_path)


# --------------------------------------------------
# Incidents
# --------------------------------------------------

def load_incidents() -> List[Dict[str, Any]]:
    return load_json("incidents.json")


def get_incidents() -> List[Dict[str, Any]]:
    return load_incidents()


def get_incident(incident_id: str) -> Optional[Dict[str, Any]]:
    incidents = get_incidents()

    for incident in incidents:
        if incident["id"] == incident_id:
            return incident

    return None


def get_incident_by_id(incident_id: str) -> Optional[Dict[str, Any]]:
    return get_incident(incident_id)


def generate_incident_id() -> str:
    incidents = get_incidents()
    numbers = []

    for incident in incidents:
        incident_id = incident.get("id", "")
        if incident_id.startswith("INC-"):
            try:
                numbers.append(int(incident_id.split("-")[-1]))
            except ValueError:
                continue

    next_number = max(numbers, default=99) + 1
    return f"INC-{next_number}"


def create_incident(
    scenario: str,
    service: str,
    description: Optional[str] = None,
    severity: str = "critical",
    recovery_profile: str = "failure",
) -> Dict[str, Any]:
    with DATA_LOCK:
        incidents = get_incidents()
        incident_id = generate_incident_id()
        created_at = __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()
        canonical_service = canonical_service_name(service) or service.strip()
        incident = {
            "id": incident_id,
            "title": scenario,
            "service": canonical_service,
            "severity": severity.lower(),
            "recovery_profile": recovery_profile,
            "simulation_profile": "memory_spike" if scenario == "Memory Usage Spike" else None,
            "status": "detected",
            "description": description or f"Simulated incident for {scenario} on {canonical_service}.",
            "created_at": created_at,
            "updated_at": created_at,
            "affected_users": 0,
            "error_rate": 0.0,
            "response_time_ms": 0.0,
            "approval": {"status": "pending", "actor": None, "decided_at": None, "comment": None},
            "rollback": {"status": "not_started"},
            "verification": {"status": "not_started"},
            "postmortem": None,
            "timeline": [{
                "timestamp": created_at,
                "type": "incident",
                "title": "Incident detected",
                "description": description or f"Simulated incident for {scenario} on {canonical_service}.",
            }],
            "audit_log": [{
                "event": "incident_created",
                "actor": "incident_simulator",
                "timestamp": created_at,
                "detail": f"Scenario: {scenario}; service: {canonical_service}.",
            }],
        }
        incidents.append(incident)
        save_json("incidents.json", incidents)
        return incident


def update_incident(
    incident_id: str,
    **updates
):
    with DATA_LOCK:
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


def record_incident_event(
    incident_id: str,
    event: str,
    detail: str,
    actor: str,
    status: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    with DATA_LOCK:
        incident = get_incident(incident_id)
        if incident is None:
            return None
        if event == "postmortem_generated" and any(
            item.get("event") == event
            for item in incident.get("audit_log", [])
        ):
            return incident

        timestamp = __import__("datetime").datetime.now(
            __import__("datetime").timezone.utc
        ).isoformat()
        incident.setdefault("timeline", []).append({
            "timestamp": timestamp,
            "type": event,
            "title": event.replace("_", " ").title(),
            "description": detail,
        })
        incident.setdefault("audit_log", []).append({
            "event": event,
            "actor": actor,
            "timestamp": timestamp,
            "detail": detail,
        })
        incident["updated_at"] = timestamp
        if status is not None:
            incident["status"] = status

        return update_incident(incident_id, **incident)


# --------------------------------------------------
# Logs
# --------------------------------------------------

def get_logs(
    incident_id: Optional[str] = None,
    service: Optional[str] = None,
):
    logs = load_json("logs.json")

    if incident_id:
        incident_logs = [
            log
            for log in logs
            if log.get("incident_id") == incident_id
        ]
        if incident_logs or not service:
            return incident_logs

    if service:
        target_service = canonical_service_name(service)
        return [
            log
            for log in logs
            if canonical_service_name(log.get("service")) == target_service
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
        target_service = canonical_service_name(service)

        return [
            metric
            for metric in metrics
            if canonical_service_name(metric.get("service")) == target_service
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
        target_service = canonical_service_name(service)

        return [
            deployment
            for deployment in deployments
            if canonical_service_name(deployment.get("service")) == target_service
        ]

    return deployments


def get_post_rollback_metrics(
    service: str,
    version: str,
    recovery_profile: str,
    action: str = "rollback",
) -> Optional[Dict[str, Any]]:
    samples = load_json("post_rollback_metrics.json")
    target_service = canonical_service_name(service)

    for sample in samples:
        if (
            canonical_service_name(sample.get("service")) == target_service
            and sample.get("version") == version
            and sample.get("recovery_profile") == recovery_profile
            and sample.get("action", "rollback") == action
        ):
            return sample

    return None


def get_incident_context(incident: Dict[str, Any]) -> Dict[str, Any]:
    incident_id = incident["id"]
    service = incident["service"]
    profile = incident.get("simulation_profile")

    if profile:
        profiles = load_json("scenario_evidence.json")
        for evidence in profiles:
            if (
                evidence.get("profile") == profile
                and canonical_service_name(evidence.get("service"))
                == canonical_service_name(service)
            ):
                return {
                    "logs": [
                        {
                            **log,
                            "timestamp": incident.get("created_at", log.get("timestamp")),
                            "incident_id": incident_id,
                            "evidence_scope": "scenario_fixture",
                        }
                        for log in evidence.get("logs", [])
                    ],
                    "metrics": [
                        {
                            **metric,
                            "timestamp": incident.get("created_at", metric.get("timestamp")),
                            "incident_id": incident_id,
                            "evidence_scope": "scenario_fixture",
                        }
                        for metric in evidence.get("metrics", [])
                    ],
                    "deployments": get_deployments(service),
                }

    return {
        "logs": get_logs(incident_id, service),
        "metrics": get_metrics(service),
        "deployments": get_deployments(service),
    }


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