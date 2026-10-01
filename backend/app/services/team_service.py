from typing import Any, Dict, List, Optional

from app.services.incident_service import DATA_LOCK, load_json, save_json


ROLE_ACCESS = {
    "Administrator": "Full Access",
    "Incident Responder": "Incident Operations",
    "Viewer": "Read Only",
}


def list_team_members() -> List[Dict[str, Any]]:
    return load_json("team_members.json")


def add_team_member(name: str, email: str, role: str) -> Dict[str, Any]:
    with DATA_LOCK:
        members = list_team_members()
        normalized_email = email.strip().lower()
        if not name.strip() or not normalized_email:
            raise ValueError("Name and email are required")
        if any(member["email"].lower() == normalized_email for member in members):
            raise ValueError("A team member with that email already exists")

        next_id = max(
            (int(member["id"].split("-")[-1]) for member in members if member.get("id", "").startswith("user-")),
            default=0,
        ) + 1
        member = {
            "id": f"user-{next_id:03d}",
            "name": name.strip(),
            "email": normalized_email,
            "role": role,
            "access": ROLE_ACCESS[role],
            "status": "Active",
        }
        members.append(member)
        save_json("team_members.json", members)
        return member


def update_team_member(member_id: str, role: Optional[str] = None, status: Optional[str] = None):
    with DATA_LOCK:
        members = list_team_members()
        for member in members:
            if member.get("id") == member_id:
                if role is not None:
                    member["role"] = role
                    member["access"] = ROLE_ACCESS[role]
                if status is not None:
                    member["status"] = status
                save_json("team_members.json", members)
                return member
    return None


def remove_team_member(member_id: str) -> bool:
    with DATA_LOCK:
        members = list_team_members()
        updated = [member for member in members if member.get("id") != member_id]
        if len(updated) == len(members):
            return False
        save_json("team_members.json", updated)
        return True
