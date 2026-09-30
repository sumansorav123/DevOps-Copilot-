import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

STATE_FILE = Path(__file__).resolve().parents[2] / "data" / "runtime_state.json"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _load() -> Dict[str, Any]:
    if not STATE_FILE.exists():
        return {"incidents": {}, "next_incident_number": 100}
    with STATE_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def _save(state: Dict[str, Any]) -> None:
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    tmp = STATE_FILE.with_suffix(".tmp")
    with tmp.open("w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)
    tmp.replace(STATE_FILE)


def seed_from_fixtures() -> None:
    state = _load()
    if state.get("incidents"):
        return

    from app.services.incident_service import load_incidents

    for incident in load_incidents():
        created = incident["created_at"]
        state["incidents"][incident["id"]] = {
            **incident,
            "type": "HTTP 500 Error Spike" if "Error" in incident["title"] else "Memory Usage Spike",
            "detected_at": created,
            "approval": {"status": "not_required", "actor": None, "decided_at": None, "comment": None},
            "rollback": {"status": "not_started"},
            "verification": {"status": "not_started"},
            "evidence": {},
            "reasoning": [],
            "timeline": [{"step": "detected", "time": created, "detail": incident["description"]}],
        }
    state["next_incident_number"] = 100
    _save(state)


def list_incidents() -> List[Dict[str, Any]]:
    seed_from_fixtures()
    state = _load()
    return list(state["incidents"].values())


def get_incident(incident_id: str) -> Optional[Dict[str, Any]]:
    seed_from_fixtures()
    return _load()["incidents"].get(incident_id)


def put_incident(incident: Dict[str, Any]) -> Dict[str, Any]:
    state = _load()
    state["incidents"][incident["id"]] = incident
    _save(state)
    return incident


def update_incident(incident_id: str, **changes: Any) -> Dict[str, Any]:
    incident = get_incident(incident_id)
    if incident is None:
        raise KeyError(incident_id)
    incident.update(changes)
    return put_incident(incident)


def next_incident_id() -> str:
    state = _load()
    number = int(state.get("next_incident_number", 100))
    incident_id = f"INC-{number}"
    state["next_incident_number"] = number + 1
    _save(state)
    return incident_id


def add_timeline(incident: Dict[str, Any], step: str, detail: str) -> None:
    incident.setdefault("timeline", []).append({"step": step, "time": now_iso(), "detail": detail})


def add_audit(incident: Dict[str, Any], event: str, detail: str) -> None:
    incident.setdefault("audit_log", []).append({"event": event, "time": now_iso(), "detail": detail})
