from datetime import datetime, timezone
from app.agent.incident_agent import investigate_incident
from app.analyzers.deployment_analyzer import correlate_deployment
from app.services.state_store import add_audit, add_timeline, put_incident


def run_investigation(incident):
    if incident["status"] not in {"detected", "investigating"}:
        return incident, None

    incident["status"] = "investigating"
    incident["investigation_started_at"] = datetime.now(timezone.utc).isoformat()
    add_timeline(incident, "investigating", "Investigation started using logs, metrics, and deployment evidence.")
    add_audit(incident, "investigation_started", "Evidence collection started.")

    deployment = incident.get("evidence", {}).get("deployment")
    if deployment:
        correlated = correlate_deployment(deployment, incident["detected_at"])
        if correlated:
            incident["evidence"]["deployment"] = correlated

    result = investigate_incident(incident)
    incident.update({
        "status": "analyzed",
        "analyzed_at": datetime.now(timezone.utc).isoformat(),
        "root_cause": result["root_cause"],
        "confidence": result["confidence"],
        "reasoning": result["reasoning"],
        "recommendation": result["recommendation"],
        "evidence": {
            "logs": result["logs"],
            "metrics": result["metrics"],
            "deployment": result["deployment"],
        },
    })
    incident["approval"] = {"status": "pending", "actor": None, "decided_at": None, "comment": None}
    add_timeline(incident, "analyzed", "Root cause and remediation recommendation generated from evidence.")
    add_timeline(incident, "approval_pending", "Human approval is required before remediation.")
    add_audit(incident, "investigation_completed", f"Root cause confidence: {result['confidence']}.")
    put_incident(incident)
    result["incident"] = incident
    return incident, result
