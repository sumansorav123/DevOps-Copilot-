from datetime import datetime, timezone

from app.services.incident_service import (
    get_incident,
    get_deployments,
    update_incident,
)


def rollback_incident(
    incident_id: str
):

    incident = get_incident(
        incident_id
    )

    if not incident:

        raise ValueError(
            "Incident not found"
        )


    deployments = get_deployments(
        incident["service"]
    )

    if not deployments:

        raise ValueError(
            "No deployment information available"
        )


    deployments = sorted(
        deployments,
        key=lambda x: x.get(
            "deployed_at",
            ""
        ),
        reverse=True,
    )

    latest = deployments[0]

    previous = latest.get(
        "previous_version"
    )


    if not previous:

        raise ValueError(
            "No previous version "
            "is available for rollback"
        )


    update_incident(

        incident_id,

        status="remediating",

        updated_at=
            datetime.now(
                timezone.utc
            ).isoformat(),
    )


    return {

        "action":
            "rollback",

        "from_version":
            latest["version"],

        "to_version":
            previous,

        "message":
            f"Rollback simulated from "
            f'{latest["version"]} '
            f"to {previous}.",
    }