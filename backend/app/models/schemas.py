from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# --------------------------------------------------
# Incident
# --------------------------------------------------

class Incident(BaseModel):
    id: str
    title: str
    service: str
    severity: str
    status: str
    description: str
    created_at: str
    updated_at: str
    affected_users: int = 0
    error_rate: float = 0.0
    response_time_ms: float = 0.0


# --------------------------------------------------
# Log
# --------------------------------------------------

class LogEntry(BaseModel):
    timestamp: str
    level: str
    service: str
    message: str
    incident_id: Optional[str] = None


# --------------------------------------------------
# Metrics
# --------------------------------------------------

class MetricPoint(BaseModel):
    timestamp: str
    service: str
    cpu: float = 0.0
    memory: float = 0.0
    error_rate: float = 0.0
    latency_ms: float = 0.0


# --------------------------------------------------
# Deployment
# --------------------------------------------------

class Deployment(BaseModel):
    id: str
    service: str
    version: str
    previous_version: Optional[str] = None
    deployed_at: str
    status: str
    changes: List[str] = []


# --------------------------------------------------
# Investigation
# --------------------------------------------------

class InvestigationRequest(BaseModel):
    incident_id: str


class InvestigationResult(BaseModel):
    incident_id: str
    summary: str
    root_cause: str
    confidence: float
    evidence: List[Dict[str, Any]]
    recommendations: List[str]
    timeline: List[Dict[str, Any]]


# --------------------------------------------------
# Remediation
# --------------------------------------------------

class RemediationRequest(BaseModel):
    incident_id: str

    action: str = Field(
        ...,
        description="rollback, restart, scale, or none"
    )

    approved: bool = False


class RemediationResult(BaseModel):
    incident_id: str
    action: str
    status: str
    message: str
    verification: Optional[Dict[str, Any]] = None


# --------------------------------------------------
# Postmortem
# --------------------------------------------------

class PostmortemRequest(BaseModel):
    incident_id: str


class PostmortemResult(BaseModel):
    incident_id: str
    title: str
    summary: str
    impact: str
    root_cause: str
    timeline: List[Dict[str, Any]]
    corrective_actions: List[str]
    prevention_actions: List[str]