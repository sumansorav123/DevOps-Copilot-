import { apiRequest } from "./client";

/**
 * Create a simulated incident through the backend.
 *
 * Backend:
 * POST /api/incidents/simulate
 *
 * Request:
 * {
 *   scenario: "HTTP 500 Error Spike",
 *   service: "Payment API"
 * }
 */
export async function createIncident({ scenario, service, severity = "critical", description, recoveryProfile = "failure" }) {
    const payload = await apiRequest("/api/incidents/simulate", {
        method: "POST",
        body: JSON.stringify({
            scenario,
            service,
            severity,
            recovery_profile: recoveryProfile,
            ...(description ? { description } : {}),
        }),
    });

    return payload?.data ?? payload;
}

/**
 * Get all incidents.
 *
 * Backend:
 * GET /api/incidents/
 */
export async function getIncidents() {
    const payload = await apiRequest("/api/incidents/");
    return payload?.data ?? payload;
}

/**
 * Get one incident by ID.
 *
 * Backend:
 * GET /api/incidents/{incident_id}
 */
export async function getIncident(incidentId) {
    const payload = await apiRequest(`/api/incidents/${incidentId}`);
    return payload?.data ?? payload;
}

/**
 * Get audit log for an incident.
 *
 * Backend:
 * GET /api/incidents/{incident_id}/audit
 */
export async function getIncidentAudit(incidentId) {
    const payload = await apiRequest(`/api/incidents/${incidentId}/audit`);
    return payload?.data ?? payload;
}

/**
 * Submit human approval/rejection.
 *
 * Backend:
 * POST /api/incidents/{incident_id}/approval
 */
export async function submitApproval(
    incidentId,
    { decision, actor = "human", comment = null }
) {
    const payload = await apiRequest(`/api/incidents/${incidentId}/approval`, {
        method: "POST",
        body: JSON.stringify({
            decision,
            actor,
            comment,
        }),
    });

    return payload?.data ?? payload;
}