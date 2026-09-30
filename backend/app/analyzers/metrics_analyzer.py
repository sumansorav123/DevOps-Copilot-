from statistics import mean

from typing import Any, Dict, List


def analyze_metrics(
    metrics: List[Dict[str, Any]]
):

    if not metrics:

        return {
            "average_cpu": 0,
            "average_memory": 0,
            "average_error_rate": 0,
            "average_latency_ms": 0,
            "anomalies": [],
        }

    cpu = [
        float(item.get("cpu", 0))
        for item in metrics
    ]

    memory = [
        float(item.get("memory", 0))
        for item in metrics
    ]

    error_rate = [
        float(item.get("error_rate", 0))
        for item in metrics
    ]

    latency = [
        float(item.get("latency_ms", 0))
        for item in metrics
    ]

    anomalies = []

    for point in metrics:

        if float(point.get("error_rate", 0)) >= 5:

            anomalies.append({
                "type": "high_error_rate",
                "timestamp": point["timestamp"],
                "value": point["error_rate"],
            })

        if float(point.get("latency_ms", 0)) >= 1000:

            anomalies.append({
                "type": "high_latency",
                "timestamp": point["timestamp"],
                "value": point["latency_ms"],
            })

        if float(point.get("cpu", 0)) >= 90:

            anomalies.append({
                "type": "high_cpu",
                "timestamp": point["timestamp"],
                "value": point["cpu"],
            })

    return {

        "average_cpu": round(
            mean(cpu), 2
        ),

        "average_memory": round(
            mean(memory), 2
        ),

        "average_error_rate": round(
            mean(error_rate), 2
        ),

        "average_latency_ms": round(
            mean(latency), 2
        ),

        "anomalies": anomalies,
    }