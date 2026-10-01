import json
import os
from typing import Any, Dict, Optional

from dotenv import load_dotenv

from app.agent.prompts import SYSTEM_PROMPT


load_dotenv()


TOOL_SOURCES = {
    "get_application_logs": "logs",
    "get_system_metrics": "metrics",
    "get_deployment_evidence": "deployments",
}


def investigate_with_openai(
    incident: Dict[str, Any],
    context: Dict[str, Any],
    evidence: list,
    analysis_mode: str,
) -> Optional[Dict[str, Any]]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        tools = [
            {
                "type": "function",
                "function": {
                    "name": tool_name,
                    "description": f"Return the available {source} evidence for this incident.",
                    "parameters": {
                        "type": "object",
                        "properties": {},
                        "additionalProperties": False,
                    },
                },
            }
            for tool_name, source in TOOL_SOURCES.items()
        ]
        messages = [
            {
                "role": "system",
                "content": (
                    f"{SYSTEM_PROMPT}\n"
                    "You are an evidence-grounded DevOps incident response agent. "
                    "Use every provided evidence tool. Do not invent missing logs, "
                    "metrics, deployments, commits, or causes. Explicitly report "
                    "missing and conflicting evidence. Return one JSON object with "
                    "summary, root_cause, confidence (0 to 1), recommendations "
                    "(string array), reasoning (string array), evidence_gaps "
                    "(string array), and conflicts (string array)."
                ),
            },
            {
                "role": "user",
                "content": json.dumps({
                    "incident": incident,
                    "analysis_mode": analysis_mode,
                    "available_sources": {
                        "logs": len(context["logs"]),
                        "metrics": len(context["metrics"]),
                        "deployments": len(context["deployments"]),
                    },
                }),
            },
        ]

        for tool_name, source in TOOL_SOURCES.items():
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                tools=tools,
                tool_choice={"type": "function", "function": {"name": tool_name}},
                temperature=0,
                max_tokens=300,
            )
            tool_call = response.choices[0].message.tool_calls[0]
            messages.append(response.choices[0].message.model_dump(exclude_none=True))
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(context[source]),
            })

        response = client.chat.completions.create(
            model=model,
            messages=messages,
            tools=tools,
            tool_choice="none",
            response_format={"type": "json_object"},
            temperature=0,
            max_tokens=1200,
        )
        result = json.loads(response.choices[0].message.content or "{}")

        root_cause = result.get("root_cause")
        confidence = float(result.get("confidence"))
        recommendations = result.get("recommendations")
        if not isinstance(root_cause, str) or not root_cause.strip():
            return None
        if not 0 <= confidence <= 1 or not isinstance(recommendations, list):
            return None

        return {
            "summary": result.get("summary") or incident["description"],
            "root_cause": root_cause,
            "confidence": confidence,
            "recommendations": [str(item) for item in recommendations],
            "reasoning": [str(item) for item in result.get("reasoning", [])],
            "evidence_gaps": [str(item) for item in result.get("evidence_gaps", [])],
            "conflicts": [str(item) for item in result.get("conflicts", [])],
            "evidence": evidence,
            "analysis_provider": "openai_tool_calling",
            "analysis_mode": analysis_mode,
        }
    except Exception:
        return None
