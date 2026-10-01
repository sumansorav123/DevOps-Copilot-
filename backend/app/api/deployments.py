from fastapi import APIRouter

from app.services.incident_service import get_deployments

router = APIRouter(prefix="/api/deployments", tags=["Deployments"])


@router.get("")
def list_deployments():
    deployments = get_deployments()
    return {
        "success": True,
        "data": sorted(
            deployments,
            key=lambda deployment: deployment.get("deployed_at", ""),
            reverse=True,
        ),
    }
