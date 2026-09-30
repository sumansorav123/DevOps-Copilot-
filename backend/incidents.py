from fastapi import APIRouter, HTTPException

from app.services.incident_service import (
    get_incidents,
get_incident,
get_logs,
get_metrics,
get_deployments,
get_dashboard_summary,
)

router = APIRouter(
    prefix="/api/incidents",
    tags=["Incidents"],
)


# --------------------------------------------------
# All Incidents
# --------------------------------------------------

@router.get("")
def list_incidents():
    return {
        "success": True,
        "data": get_all_incidents(),
    }


# --------------------------------------------------
# Dashboard
# --------------------------------------------------

@router.get("/dashboard")
def dashboard():

    return {

        "success": True,

        "data":
            get_dashboard_summary(),
    }


# --------------------------------------------------
# Incident Details
# --------------------------------------------------

@router.get("/{incident_id}")
def incident_details(incident_id: str):
    incident = get_incident(incident_id)

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    return {
        "success": True,
        "data": incident,
    }

# --------------------------------------------------
# Incident Logs
# --------------------------------------------------

@router.get("/{incident_id}/logs")
def incident_logs(
    incident_id: str
):

    if not get_incident(incident_id):

        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )


    return {

        "success": True,

        "data":
            get_logs(incident_id),
    }


# --------------------------------------------------
# Incident Metrics
# --------------------------------------------------

@router.get("/{incident_id}/metrics")
def incident_metrics(
    incident_id: str
):

    incident = get_incident(
        incident_id
    )

    if not incident:

        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )


    return {

        "success": True,

        "data":
            get_metrics(
                incident["service"]
            ),
    }


# --------------------------------------------------
# Incident Deployments
# --------------------------------------------------

@router.get("/{incident_id}/deployments")
def incident_deployments(
    incident_id: str
):

    incident = get_incident(
        incident_id
    )

    if not incident:

        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )


    return {

        "success": True,

        "data":
            get_deployments(
                incident["service"]
            ),
    }