from datetime import datetime

from app.services.incident_service import (
    get_incident,
    get_incident_context,
    get_post_rollback_metrics,
    record_incident_event,
    update_incident,
)
from app.analyzers.metrics_analyzer import MEMORY_USAGE_THRESHOLD


def verify_incident(
    incident_id: str
):
    incident = get_incident(incident_id)
    if not incident:
        return {
            "verified": False,
            "status": "failed",
            "message": "Incident not found.",
            "metrics_before": None,
            "metrics_after": None,
            "comparison": {},
        }

    remediation = incident.get("remediation") or incident.get("rollback", {})
    if remediation.get("status") != "completed":
        return {
            "verified": False,
            "status": "not_started",
            "message": "Verification requires a completed remediation action.",
            "metrics_before": None,
            "metrics_after": None,
            "comparison": {},
        }

    def parse_timestamp(value: str) -> datetime:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))

    remediation_started = parse_timestamp(remediation["started_at"])
    metrics = get_incident_context(incident)["metrics"]
    before_candidates = [
        metric
        for metric in metrics
        if parse_timestamp(metric["timestamp"]) <= remediation_started
    ]
    before_candidates.sort(key=lambda metric: parse_timestamp(metric["timestamp"]))
    metrics_before = before_candidates[-1] if before_candidates else None

    action = remediation.get("action", "rollback")
    target_version = remediation.get("to_version") or remediation.get("from_version")
    recovery_sample = get_post_rollback_metrics(
        incident["service"],
        target_version,
        incident.get("recovery_profile", "failure"),
        action,
    )
    if not recovery_sample or not metrics_before:
        message = (
            "No post-remediation metric sample matches this service, action, version, and recovery profile."
            if not recovery_sample
            else "No pre-remediation metrics are available for comparison."
        )
        verification_state = {
            "status": "failed",
            "verified": False,
            "message": message,
            "metrics_before": metrics_before,
            "metrics_after": None,
            "comparison": {},
        }
        update_incident(incident_id, verification=verification_state, status="failed")
        record_incident_event(incident_id, "verification_failed", message, "verification_service")
        return {"verified": False, **verification_state}

    metrics_after = {
        **recovery_sample["metrics"],
        "timestamp": remediation["completed_at"],
        "service": incident["service"],
        "version": target_version,
        "action": action,
    }
    error_rate = float(metrics_after.get("error_rate", 0))
    latency = float(metrics_after.get("latency_ms", 0))
    healthy = error_rate < 5 and latency < 1000
    if incident.get("simulation_profile") == "memory_spike":
        healthy = healthy and float(metrics_after.get("memory", 0)) < MEMORY_USAGE_THRESHOLD

    comparison = {
        "error_rate_delta": round(float(metrics_before.get("error_rate", 0)) - error_rate, 2),
        "latency_delta": round(float(metrics_before.get("latency_ms", 0)) - latency, 2),
        "memory_delta": round(float(metrics_before.get("memory", 0)) - float(metrics_after.get("memory", 0)), 2),
        "status": "recovered" if healthy else "degraded",
    }
    verification_state = {
        "status": "passed" if healthy else "failed",
        "verified": healthy,
        "message": (
            "Service appears healthy after remediation."
            if healthy
            else "Service still shows abnormal metrics."
        ),
        "metrics_before": metrics_before,
        "metrics_after": metrics_after,
        "comparison": comparison,
    }
    final_status = "resolved" if healthy else "failed"
    update_incident(incident_id, verification=verification_state, status=final_status)
    record_incident_event(
        incident_id,
        "verification_passed" if healthy else "verification_failed",
        verification_state["message"],
        "verification_service",
        status=final_status,
    )

    return {"verified": healthy, **verification_state, "latest_metrics": metrics_after}