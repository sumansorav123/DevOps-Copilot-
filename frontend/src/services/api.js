const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.message ||
      `API request failed (${response.status})`
    );
  }

  return data;
}

// --------------------------------------------------
// API
// --------------------------------------------------

export const api = {

  // ------------------------------------------------
  // Health
  // ------------------------------------------------

  health: () =>
    request("/health"),


  // ------------------------------------------------
  // Dashboard
  // ------------------------------------------------

  dashboard: () =>
    request("/api/incidents/dashboard"),


  // ------------------------------------------------
  // Incidents
  // ------------------------------------------------

  incidents: () =>
    request("/api/incidents"),

  incident: (id) =>
    request(`/api/incidents/${id}`),


  // ------------------------------------------------
  // Investigation Evidence
  // ------------------------------------------------

  logs: (id) =>
    request(`/api/incidents/${id}/logs`),

  metrics: (id) =>
    request(`/api/incidents/${id}/metrics`),

  deployments: (id) =>
    request(`/api/incidents/${id}/deployments`),


  // ------------------------------------------------
  // AI Investigation
  // ------------------------------------------------

  investigate: (incidentId) =>
    request("/api/investigation", {
      method: "POST",

      body: JSON.stringify({
        incident_id: incidentId,
      }),
    }),


  // ------------------------------------------------
  // Remediation / Human Approval
  // ------------------------------------------------

  remediate: ({
    incidentId,
    action,
    approved = false,
  }) =>
    request("/api/remediation", {
      method: "POST",

      body: JSON.stringify({
        incident_id: incidentId,
        action,
        approved,
      }),
    }),


  // ------------------------------------------------
  // Verification
  // ------------------------------------------------

  verification: (incidentId) =>
    request(`/api/verification/${incidentId}`),


  // ------------------------------------------------
  // Postmortem
  // ------------------------------------------------

  postmortem: (incidentId) =>
    request("/api/postmortem", {
      method: "POST",

      body: JSON.stringify({
        incident_id: incidentId,
      }),
    }),
};


export default api;