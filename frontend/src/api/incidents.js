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
export async function createIncident({ scenario, service, description }) {
    return apiRequest("/api/incidents/simulate", {
        method: "POST",
        body: JSON.stringify({
            scenario,
            service,
            ...(description ? { description } : {}),
        }),
    });
}

/**
 * Get all incidents.
 *
 * Backend:
 * GET /api/incidents/
 */
export async function getIncidents() {
    return apiRequest("/api/incidents/");
}

/**
 * Get one incident by ID.
 *
 * Backend:
 * GET /api/incidents/{incident_id}
 */
export async function getIncident(incidentId) {
    return apiRequest(`/api/incidents/${incidentId}`);
}

/**
 * Get audit log for an incident.
 *
 * Backend:
 * GET /api/incidents/{incident_id}/audit
 */
export async function getIncidentAudit(incidentId) {
    return apiRequest(`/api/incidents/${incidentId}/audit`);
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
    return apiRequest(`/api/incidents/${incidentId}/approval`, {
        method: "POST",
        body: JSON.stringify({
            decision,
            actor,
            comment,
        }),
    });
}