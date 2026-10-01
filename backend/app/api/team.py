from fastapi import APIRouter, HTTPException, status

from app.models.schemas import TeamMemberCreateRequest, TeamMemberUpdateRequest
from app.services.team_service import (
    add_team_member,
    list_team_members,
    remove_team_member,
    update_team_member,
)

router = APIRouter(prefix="/api/team-members", tags=["Team"])


@router.get("")
def get_team_members():
    return {"success": True, "data": list_team_members()}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_team_member(request: TeamMemberCreateRequest):
    try:
        member = add_team_member(request.name, request.email, request.role)
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    return {"success": True, "data": member}


@router.patch("/{member_id}")
def edit_team_member(member_id: str, request: TeamMemberUpdateRequest):
    changes = request.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(status_code=400, detail="Provide a role or status to update")
    member = update_team_member(member_id, **changes)
    if member is None:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"success": True, "data": member}


@router.delete("/{member_id}")
def delete_team_member(member_id: str):
    if not remove_team_member(member_id):
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"success": True, "data": {"id": member_id, "deleted": True}}
