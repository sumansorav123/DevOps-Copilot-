from app.agent.incident_agent import (
    investigate_incident
)

from app.services.incident_service import (
    get_incident,
    record_incident_event,
    update_incident,
)


def generate_postmortem(
    incident_id: str
):

    incident = get_incident(
        incident_id
    )

    if not incident:

        raise ValueError(
            "Incident not found"
        )

    if incident.get("postmortem"):
        return incident["postmortem"]


    investigation = incident.get("recommendation") or investigate_incident(incident_id)
    record_incident_event(
        incident_id,
        "postmortem_generated",
        "Postmortem generated from persisted incident and verification state.",
        "postmortem_service",
    )
    incident = get_incident(incident_id)


    verification = incident.get("verification", {})
    impact_metrics = (
        verification.get("metrics_before")
        or verification.get("metrics_after")
        or {}
    )
    error_rate = impact_metrics.get("error_rate", incident["error_rate"])
    response_time = impact_metrics.get(
        "latency_ms",
        incident["response_time_ms"],
    )
    impact = (
        f'{incident["affected_users"]} users were affected. '
        f"Observed error rate was approximately {error_rate}%. "
        f"Observed response time was approximately {response_time} ms."
    )
    memory_before = (verification.get("metrics_before") or {}).get("memory")
    memory_after = (verification.get("metrics_after") or {}).get("memory")
    if memory_before is not None or memory_after is not None:
        impact += f" Memory utilization changed from {memory_before if memory_before is not None else 'unavailable'}% to {memory_after if memory_after is not None else 'unavailable'}%."

    verification_status = verification.get("status", "not_started")
    resolution_status = {
        "passed": "resolved",
        "failed": "unresolved",
    }.get(verification_status, "not_verified")

    timeline = list(incident.get("timeline", []))
    known_events = {
        (event.get("timestamp"), event.get("type"), event.get("title"))
        for event in timeline
    }
    for event in investigation.get("timeline", []):
        identity = (event.get("timestamp"), event.get("type"), event.get("title"))
        if identity not in known_events:
            timeline.append(event)
            known_events.add(identity)
    timeline.sort(key=lambda event: event.get("timestamp", ""))

    report = {

        "incident_id":
            incident_id,

        "service":
            incident["service"],

        "severity":
            incident["severity"],

        "status":
            incident["status"],

        "title":
            f'Postmortem: '
            f'{incident["title"]}',

        "summary":
            investigation["summary"],

        "impact":
            impact,

        "root_cause":
            investigation["root_cause"],

        "evidence":
            investigation.get("evidence", []),

        "analysis":
            investigation.get("analysis", {}),

        "approval":
            incident.get("approval", {}),

        "remediation":
            incident.get("remediation") or incident.get("rollback", {}),

        "verification": {
            "status": verification_status,
            "verified": verification.get("verified"),
            "message": verification.get(
                "message",
                "Verification has not been run.",
            ),
            "metrics_before": verification.get("metrics_before"),
            "metrics_after": verification.get("metrics_after"),
        },

        "resolution": {
            "status": resolution_status,
            "message": (
                "Incident recovery was verified."
                if resolution_status == "resolved"
                else "Recovery has not been verified."
                if resolution_status == "not_verified"
                else "Verification failed; further investigation is required."
            ),
        },

        "timeline":
            timeline,

        "corrective_actions":
            investigation["recommendations"],

        "prevention_actions": [

            "Add deployment health checks.",

            "Improve application error monitoring.",

            "Configure alerts for elevated "
            "error rates and latency.",

            "Require approval for production "
            "rollback/remediation actions.",
        ],
    }

    update_incident(incident_id, postmortem=report)
    return report