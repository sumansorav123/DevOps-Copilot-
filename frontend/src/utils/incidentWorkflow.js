const ACTIVE_INCIDENT_KEY = "devops-copilot.activeIncidentId";

export function rememberIncidentId(incidentId) {
  if (incidentId) {
    localStorage.setItem(ACTIVE_INCIDENT_KEY, incidentId);
  }
}

export function getActiveIncidentId() {
  return localStorage.getItem(ACTIVE_INCIDENT_KEY);
}

export function getIncidentId(routeState) {
  const incidentId =
    routeState?.incident?.id || routeState?.incidentId ||
    localStorage.getItem(ACTIVE_INCIDENT_KEY);

  rememberIncidentId(incidentId);
  return incidentId;
}

export function unwrapResponse(response) {
  return response?.data ?? response;
}

export function goToWorkflow(navigate, path, incidentId) {
  rememberIncidentId(incidentId);
  navigate(path, { state: { incidentId } });
}
