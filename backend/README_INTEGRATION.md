# DevOps Incident Agent Integration

The active application uses FastAPI, JSON fixtures, and one persisted incident record for the workflow. Remediation is simulated; no production deployment is changed.

## Run

Use Python 3.13, create/activate a virtual environment, then install and start:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirement.txt
python run.py
```

Backend: `http://localhost:8000`  
Frontend: `http://localhost:5173`  
Swagger: `http://localhost:8000/docs`

## Optional OpenAI Analysis

Copy `.env.example` to `.env` and set `OPENAI_API_KEY`. `OPENAI_MODEL` defaults to `gpt-4o-mini`. The agent uses OpenAI tool calling for application logs, metrics, and deployment evidence when configured. Without a key or if the model request fails, it uses the deterministic evidence-rule fallback and returns `analysis_provider` plus `analysis_notice`; it does not claim model analysis ran.

## API Contract

All incident IDs come from the response to `POST /api/incidents/simulate` and are used for subsequent requests.

- `GET /health` returns backend health.
- `GET /api/incidents` lists persisted incidents.
- `GET /api/incidents/dashboard` returns incident counts.
- `POST /api/incidents/simulate` accepts `scenario`, `service`, `severity`, and `recovery_profile` (`failure` or `success`). `Memory Usage Spike` is supported for `User Service`; payment rollback profiles are supported for `Payment API`.
- `GET /api/incidents/{id}` returns the incident and lifecycle state.
- `GET /api/incidents/{id}/logs`, `/metrics`, `/deployments`, and `/audit` return evidence/events for that incident. Generated scenarios can use explicitly marked fixture evidence associated with their new incident ID.
- `GET /api/deployments` returns the deployment fixture list including commit IDs.
- `GET /api/team-members`, `POST /api/team-members`, `PATCH /api/team-members/{id}`, and `DELETE /api/team-members/{id}` manage the persisted prototype directory. This is not an authentication or authorization system.
- `POST /api/investigation` accepts `incident_id` and optional `analysis_mode` (`Evidence Based`, `Conservative`, `Detailed`); it persists the analysis and sets the incident to `approval_pending`.
- `POST /api/incidents/{id}/approval` accepts `decision` (`approved` or `rejected`), `actor`, and optional `comment`. Decisions are persisted and conflicting repeat decisions are rejected. The actor is currently a submitted label, not an authenticated identity.
- `POST /api/remediation` accepts `incident_id`, the recommended `action`, and legacy `approved` request data. Authorization comes from the persisted incident approval; the request boolean is not trusted. The requested action must match the persisted recommendation.
- `GET /api/verification/{id}` returns the persisted verification result. `POST /api/verification` is also available to run verification after a completed remediation.
- `POST /api/postmortem` accepts `incident_id`, generates an idempotent report from persisted investigation/remediation/verification state, and stores it on the incident.

## Recovery Behavior

Payment rollback samples are selected by service, target version, action, and recovery profile. Existing health thresholds remain `error_rate < 5` and `latency_ms < 1000`. The memory-spike scenario additionally requires memory below the configured 85% anomaly threshold. A failed recovery remains failed; it is not converted to success.

The incident record stores approval, recommendation, remediation/rollback, verification, audit/timeline events, and postmortem. JSON data is under `backend/data/`.

Settings preferences are stored in browser localStorage. Notification toggles are preferences only; no email/push delivery channel is configured. The team directory stores role metadata, but the backend does not authenticate identities or enforce these roles.
