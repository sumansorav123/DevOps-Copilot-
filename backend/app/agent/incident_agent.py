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
from app.agent.llm_investigator import investigate_with_openai


def investigate_incident(
    incident_id: str,
    analysis_mode: str = "Evidence Based",
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


    elif any(
        anomaly["type"] == "high_memory"
        for anomaly in metric_result["anomalies"]
    ):

        root_cause = (
            "The available metrics show a memory-pressure signal. "
            "No suspicious deployment was identified, so the cause "
            "remains a hypothesis rather than a confirmed change regression."
        )
        confidence = 0.78
        recommendations.extend([
            "Scale the affected service after human approval.",
            "Verify memory utilization and service health after scaling.",
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
                "; ".join(filter(None, [
                    f'Commit {deployment["commit"]}' if deployment.get("commit") else None,
                    ", ".join(deployment.get("changes", [])),
                ])),
        })


    timeline.sort(
        key=lambda x: x["timestamp"]
    )

    evidence_gaps = []
    if not context["logs"]:
        evidence_gaps.append("No application logs are available for this service.")
    if not context["metrics"]:
        evidence_gaps.append("No metrics are available for this service.")
    if not context["deployments"]:
        evidence_gaps.append("No deployment or commit information is available for this service.")

    conflicts = []
    if log_result["error_count"] > 0 and not metric_result["anomalies"]:
        conflicts.append("Logs show application errors while metrics remain below configured anomaly thresholds.")
    if deployment_result["suspicious"] and log_result["error_count"] == 0:
        conflicts.append("The latest deployment is marked failed/degraded, but no error-level logs were found.")
    if deployment_result["suspicious"] and not metric_result["anomalies"]:
        conflicts.append("The latest deployment is marked failed/degraded, but no metric anomalies were found.")

    recommended_action = "none"
    if any("rollback" in recommendation.lower() for recommendation in recommendations):
        recommended_action = "rollback"
    elif any("scale" in recommendation.lower() for recommendation in recommendations):
        recommended_action = "scale"
    elif any("restart" in recommendation.lower() for recommendation in recommendations):
        recommended_action = "restart"

    latest_deployment = deployment_result["recent_deployment"]
    recommendation = {
        "action": recommended_action,
        "from_version": latest_deployment.get("version") if latest_deployment else None,
        "target_version": latest_deployment.get("previous_version") if latest_deployment else None,
        "reason": root_cause,
    }

    if analysis_mode == "Conservative":
        confidence = min(confidence, 0.6)


    result = {

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

        "recommended_action":
            recommendation,

        "evidence_gaps":
            evidence_gaps,

        "conflicts":
            conflicts,

        "reasoning": [
            root_cause,
            *[f"Conflicting evidence: {conflict}" for conflict in conflicts],
        ],

        "analysis_provider":
            "rules",

        "analysis_mode":
            analysis_mode,

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

    model_result = investigate_with_openai(
        incident,
        context,
        evidence,
        analysis_mode,
    )
    if model_result:
        result.update(model_result)
        if analysis_mode == "Conservative":
            result["confidence"] = min(float(result["confidence"]), 0.6)
        model_recommendations = result["recommendations"]
        if any("rollback" in item.lower() for item in model_recommendations):
            action = "rollback"
        elif any("scale" in item.lower() for item in model_recommendations):
            action = "scale"
        elif any("restart" in item.lower() for item in model_recommendations):
            action = "restart"
        else:
            action = "none"
        result["recommended_action"] = {
            **recommendation,
            "action": action,
            "reason": result["root_cause"],
        }
    else:
        result["analysis_provider"] = "rules_fallback"
        result["analysis_notice"] = (
            "OpenAI analysis is unavailable; deterministic evidence rules were used."
        )

    if analysis_mode == "Detailed":
        detailed_reasoning = [
            f"Reviewed {log_result['total_logs']} logs, {len(context['metrics'])} metric samples, and {deployment_result['deployment_count']} deployments.",
            *[
                f"Metric anomaly: {item['type']} at {item['timestamp']} ({item['value']})."
                for item in metric_result["anomalies"]
            ],
        ]
        deployment = deployment_result["recent_deployment"]
        if deployment:
            commit = f" commit {deployment['commit']}" if deployment.get("commit") else ""
            detailed_reasoning.append(
                f"Latest deployment: {deployment['version']}{commit}, status {deployment.get('status', 'unknown')}."
            )
        result["reasoning"] = detailed_reasoning + result.get("reasoning", [])

    return result