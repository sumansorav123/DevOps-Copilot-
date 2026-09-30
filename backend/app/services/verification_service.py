from app.services.incident_service import (
    get_incident,
    get_metrics,
)


def verify_incident(
    incident_id: str
):

    incident = get_incident(
        incident_id
    )

    if not incident:

        return {

            "verified": False,

            "message":
                "Incident not found.",
        }


    metrics = get_metrics(
        incident["service"]
    )

    if not metrics:

        return {

            "verified": False,

            "message":
                "No metrics available "
                "for verification.",
        }


    latest = metrics[-1]

    error_rate = float(
        latest.get(
            "error_rate",
            0
        )
    )

    latency = float(
        latest.get(
            "latency_ms",
            0
        )
    )


    healthy = (
        error_rate < 5
        and latency < 1000
    )


    return {

        "verified":
            healthy,

        "message": (

            "Service appears healthy "
            "after remediation."

            if healthy

            else

            "Service still shows "
            "abnormal metrics."
        ),

        "latest_metrics":
            latest,
    }