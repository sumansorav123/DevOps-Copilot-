# EvoOps Copilot Backend — Frontend Integration Contract

This backend implements the complete hackathon lifecycle:

`Incident → Investigation → Root Cause → Recommendation → Human Approval → Rollback → Verification → Postmortem`

The backend is the source of truth for incident status, classification, evidence, root cause, recommendation, approval, rollback, verification, and postmortem.

## Start

```bash
cd backend
python -m venv venv
# Windows PowerShell
.\venv\Scripts\Activate.ps1
pip install -r requirement.txt
python run.py
```

API base URL: `http://127.0.0.1:8000`

Swagger: `http://127.0.0.1:8000/docs`

## Endpoints

### 1. Create/simulate incident

`POST /api/incidents/simulate`

```json
{
  "scenario": "HTTP 500 Error Spike",
  "service": "Payment API"
}
```

The frontend should not be the final authority for severity/type. The backend classifies them from the scenario and generated evidence.

Response contains the new `incident.id` and `status: detected`.

### 2. Get incidents

`GET /api/incidents/`

### 3. Get one incident

`GET /api/incidents/{incident_id}`

The returned incident contains the complete persisted workflow state.

### 4. Investigate

`POST /api/investigation/`

```json
{
  "incident_id": "INC-100"
}
```

Returns:

- `incident`
- `logs`
- `metrics`
- `deployment`
- `deployment_correlation`
- `root_cause`
- `confidence`
- `reasoning`
- `recommendation`
- `evidence`

Successful investigation moves the incident to `analyzed` and then `approval_pending` conceptually through the persisted timeline; the persisted status used for the approval gate is `analyzed`.

### 5. Human approval

`POST /api/incidents/{incident_id}/approval`

```json
{
  "decision": "approved",
  "actor": "human",
  "comment": "Approve simulated rollback"
}
```

Allowed decisions: `approved`, `rejected`.

Approval is persisted. Rollback cannot execute unless the persisted decision is `approved`.

### 6. Rollback

`POST /api/remediation/rollback`

```json
{
  "incident_id": "INC-100",
  "action": "Rollback to previous stable version"
}
```

Rollback updates the incident through `remediation_running` to `remediated` and records the source/target deployment versions.

### 7. Verification

`POST /api/verification/`

```json
{
  "incident_id": "INC-100"
}
```

The backend captures pre-rollback metrics, creates a simulated post-rollback health state, compares before/after values, and sets the incident to `resolved` or `failed`.

### 8. Verification state

`GET /api/verification/{incident_id}`

### 9. Postmortem

`POST /api/postmortem/{incident_id}`

No root cause/action/verification fields are supplied by the frontend. The backend generates the postmortem from persisted workflow state.

### 10. Existing postmortem

`GET /api/postmortem/{incident_id}`

### 11. Audit log

`GET /api/incidents/{incident_id}/audit`

## Lifecycle

The persisted status values are:

- `detected`
- `investigating`
- `analyzed`
- `approval_pending` represented by the pending approval state while analysis is complete
- `approved`
- `rejected`
- `remediation_running`
- `remediated`
- `verification_running`
- `resolved`
- `failed`

The exact approval gate is enforced by the rollback service.

## Important frontend rule

Do not keep the incident/root-cause/rollback/verification values as independent frontend truth. Store the active `incidentId` and refresh the incident from the backend after each workflow action.
