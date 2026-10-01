from typing import Any, Dict, List, Literal, Optional

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


class SimulateIncidentRequest(BaseModel):
    scenario: Literal["HTTP 500 Error Spike", "Memory Usage Spike"]
    service: str
    description: Optional[str] = None
    severity: Literal["low", "medium", "high", "critical"] = "critical"
    recovery_profile: Literal["failure", "success"] = "failure"


class IncidentApprovalRequest(BaseModel):
    decision: str = Field(..., description="approved or rejected")
    actor: str = "human"
    comment: Optional[str] = None


class TeamMemberCreateRequest(BaseModel):
    name: str
    email: str
    role: Literal["Administrator", "Incident Responder", "Viewer"]


class TeamMemberUpdateRequest(BaseModel):
    role: Optional[Literal["Administrator", "Incident Responder", "Viewer"]] = None
    status: Optional[Literal["Active", "Inactive"]] = None


class VerificationResponse(BaseModel):
    incident: Optional[Dict[str, Any]] = None
    status: str
    message: str
    metrics_before: Optional[Dict[str, Any]] = None
    metrics_after: Optional[Dict[str, Any]] = None
    comparison: Dict[str, Any] = Field(default_factory=dict)


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
    analysis_mode: Literal["Evidence Based", "Conservative", "Detailed"] = "Evidence Based"


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
    action: Literal["rollback", "restart", "scale"]

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