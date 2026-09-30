from typing import Any, Dict

from app.agent.tools import (
    fetch_incident_context
)

from app.analyzers.log_analyzer import (
    analyze_logs
)

from app.analyzers.metrics_analyzer import (
    analyze_metrics
)

from app.analyzers.deployment_analyzer import (
    analyze_deployments
)


def investigate_incident(
    incident_id: str
) -> Dict[str, Any]:

    context = fetch_incident_context(
        incident_id
    )

    incident = context["incident"]

    log_result = analyze_logs(
        context["logs"]
    )

    metric_result = analyze_metrics(
        context["metrics"]
    )

    deployment_result = analyze_deployments(
        context["deployments"]
    )

    evidence = []

    recommendations = []


    # --------------------------------------------------
    # Log Evidence
    # --------------------------------------------------

    if log_result["error_count"] > 0:

        evidence.append({

            "source": "logs",

            "finding":
                f'{log_result["error_count"]} '
                'error/critical log entries detected.',

            "details":
                log_result["patterns"],
        })


    # --------------------------------------------------
    # Metrics Evidence
    # --------------------------------------------------

    if metric_result["anomalies"]:

        evidence.append({

            "source": "metrics",

            "finding":
                f'{len(metric_result["anomalies"])} '
                'metric anomalies detected.',

            "details":
                metric_result["anomalies"][:10],
        })


    # --------------------------------------------------
    # Deployment Evidence
    # --------------------------------------------------

    if deployment_result["suspicious"]:

        evidence.append({

            "source": "deployment",

            "finding":
                "The latest deployment has "
                "a degraded or failed status.",

            "details":
                deployment_result[
                    "recent_deployment"
                ],
        })


    # --------------------------------------------------
    # Root Cause Engine
    # --------------------------------------------------

    if (
        deployment_result["suspicious"]
        and log_result["error_count"] > 0
    ):

        root_cause = (
            "The incident is strongly associated "
            "with the latest deployment. "
            "Application errors appeared together "
            "with a degraded or failed deployment."
        )

        confidence = 0.88

        recommendations.extend([

            "Review the latest deployment changes.",

            "Rollback to the previous stable "
            "version after approval.",

            "Verify error rate and latency "
            "after rollback.",
        ])


    elif (
        log_result["error_count"] > 0
        and metric_result["anomalies"]
    ):

        root_cause = (
            "Application errors coincide with "
            "metric anomalies. The evidence "
            "suggests a service-level "
            "performance failure."
        )

        confidence = 0.72

        recommendations.extend([

            "Inspect the highest-frequency "
            "application errors.",

            "Check resource utilization "
            "and dependency health.",

            "Consider restarting or scaling "
            "the affected service.",
        ])


    elif log_result["error_count"] > 0:

        root_cause = (
            "Application-level errors are the "
            "primary observed signal, but the "
            "available evidence is insufficient "
            "for a definitive cause."
        )

        confidence = 0.58

        recommendations.extend([

            "Inspect the error stack traces.",

            "Check dependent services "
            "and database connectivity.",
        ])


    else:

        root_cause = (
            "No strong root-cause signal was "
            "found in the available logs, "
            "metrics, or deployment records."
        )

        confidence = 0.35

        recommendations.extend([

            "Collect additional logs.",

            "Check external dependencies.",

            "Review infrastructure health.",
        ])


    # --------------------------------------------------
    # Timeline
    # --------------------------------------------------

    timeline = []

    for log in context["logs"][:10]:

        timeline.append({

            "timestamp":
                log["timestamp"],

            "type":
                "log",

            "title":
                log["level"],

            "description":
                log["message"],
        })


    for deployment in context[
        "deployments"
    ][:3]:

        timeline.append({

            "timestamp":
                deployment[
                    "deployed_at"
                ],

            "type":
                "deployment",

            "title":
                f'Deployment '
                f'{deployment["version"]}',

            "description":
                ", ".join(
                    deployment.get(
                        "changes",
                        []
                    )
                ),
        })


    timeline.sort(
        key=lambda x: x["timestamp"]
    )


    return {

        "incident_id":
            incident_id,

        "summary":
            incident["description"],

        "root_cause":
            root_cause,

        "confidence":
            confidence,

        "evidence":
            evidence,

        "recommendations":
            recommendations,

        "timeline":
            timeline,

        "analysis": {

            "logs":
                log_result,

            "metrics":
                metric_result,

            "deployments":
                deployment_result,
        },
    }