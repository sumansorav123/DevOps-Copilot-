from app.agent.incident_agent import (
    investigate_incident
)

from app.services.incident_service import (
    get_incident
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


    investigation = investigate_incident(
        incident_id
    )


    impact = (

        f'{incident["affected_users"]} '
        "users were affected. "

        f'Observed error rate was approximately '
        f'{incident["error_rate"]}%. '

        f'Observed response time was approximately '
        f'{incident["response_time_ms"]} ms.'
    )


    return {

        "incident_id":
            incident_id,

        "title":
            f'Postmortem: '
            f'{incident["title"]}',

        "summary":
            investigation["summary"],

        "impact":
            impact,

        "root_cause":
            investigation["root_cause"],

        "timeline":
            investigation["timeline"],

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