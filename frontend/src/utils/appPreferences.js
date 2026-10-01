const PREFERENCES_KEY = "devops-copilot.preferences";

export const DEFAULT_PREFERENCES = {
  incidentNotifications: true,
  approvalNotifications: true,
  defaultSeverity: "critical",
  analysisMode: "Evidence Based",
};

export function getPreferences() {
  try {
    return {
      ...DEFAULT_PREFERENCES,
      ...JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}"),
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function savePreferences(preferences) {
  const next = { ...getPreferences(), ...preferences };
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
  return next;
}
