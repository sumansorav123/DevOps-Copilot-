from collections import Counter
from typing import Any, Dict, List


ERROR_WORDS = (
    "error",
    "exception",
    "failed",
    "timeout",
    "connection refused",
    "database",
    "500",
    "503",
    "crash",
)


def analyze_logs(
    logs: List[Dict[str, Any]]
):

    error_logs = []

    for log in logs:

        level = log.get(
            "level",
            ""
        ).upper()

        message = log.get(
            "message",
            ""
        ).lower()

        if (
            level in ("ERROR", "CRITICAL")
            or any(
                word in message
                for word in ERROR_WORDS
            )
        ):
            error_logs.append(log)

    messages = Counter(
        log.get("message", "")
        for log in error_logs
    )

    patterns = [
        {
            "message": message,
            "count": count,
        }

        for message, count
        in messages.most_common(5)
    ]

    return {

        "total_logs": len(logs),

        "error_count": len(error_logs),

        "patterns": patterns,

        "errors": error_logs[:20],
    }