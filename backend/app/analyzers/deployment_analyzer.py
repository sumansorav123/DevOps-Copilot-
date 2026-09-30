from typing import Any, Dict, List


def analyze_deployments(
    deployments: List[Dict[str, Any]]
):

    if not deployments:

        return {
            "recent_deployment": None,
            "deployment_count": 0,
            "suspicious": False,
        }

    deployments = sorted(
        deployments,
        key=lambda x: x.get(
            "deployed_at",
            ""
        ),
        reverse=True,
    )

    latest = deployments[0]

    suspicious = latest.get(
        "status"
    ) in (
        "failed",
        "degraded",
    )

    return {

        "recent_deployment": latest,

        "deployment_count":
            len(deployments),

        "suspicious": suspicious,
    }