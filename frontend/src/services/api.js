import { API_BASE_URL } from "../api/config";

const inFlightPosts = new Map();

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = (options.method || "GET").toUpperCase();
  const requestKey = method === "POST"
    ? `${method}:${url}:${options.body || ""}`
    : null;
  const pendingRequest = requestKey && inFlightPosts.get(requestKey);
  if (pendingRequest) return pendingRequest;

  const requestPromise = (async () => {
    const response = await fetch(url, {
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
  })();

  if (!requestKey) return requestPromise;

  inFlightPosts.set(requestKey, requestPromise);
  try {
    return await requestPromise;
  } finally {
    if (inFlightPosts.get(requestKey) === requestPromise) {
      inFlightPosts.delete(requestKey);
    }
  }
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

  approve: (incidentId, decision, comment = null) =>
    request(`/api/incidents/${incidentId}/approval`, {
      method: "POST",
      body: JSON.stringify({ decision, actor: "human", comment }),
    }),


  // ------------------------------------------------
  // Investigation Evidence
  // ------------------------------------------------

  logs: (id) =>
    request(`/api/incidents/${id}/logs`),

  metrics: (id) =>
    request(`/api/incidents/${id}/metrics`),

  deployments: (id) =>
    request(`/api/incidents/${id}/deployments`),

  allDeployments: () =>
    request("/api/deployments"),

  incidentAudit: (id) =>
    request(`/api/incidents/${id}/audit`),

  teamMembers: () =>
    request("/api/team-members"),

  addTeamMember: (member) =>
    request("/api/team-members", {
      method: "POST",
      body: JSON.stringify(member),
    }),

  updateTeamMember: (id, changes) =>
    request(`/api/team-members/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }),

  deleteTeamMember: (id) =>
    request(`/api/team-members/${id}`, { method: "DELETE" }),


  // ------------------------------------------------
  // AI Investigation
  // ------------------------------------------------

  investigate: (incidentId, analysisMode = "Evidence Based") =>
    request("/api/investigation", {
      method: "POST",

      body: JSON.stringify({
        incident_id: incidentId,
        analysis_mode: analysisMode,
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