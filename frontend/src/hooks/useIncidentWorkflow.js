import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import { getActiveIncidentId, unwrapResponse } from "../utils/incidentWorkflow";
import { getPreferences } from "../utils/appPreferences";

export function useIncidentWorkflow({ includeEvidence = false, includeInvestigation = false } = {}) {
  const location = useLocation();
  const incidentId =
    location.state?.incidentId ||
    location.state?.incident?.id ||
    getActiveIncidentId();
  const [workflow, setWorkflow] = useState({
    incident: null,
    investigation: null,
    logs: [],
    metrics: [],
    deployments: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadWorkflow() {
      if (!incidentId) {
        setWorkflow((current) => ({
          ...current,
          loading: false,
          error: "No active incident. Start from the incident simulator or incident list.",
        }));
        return;
      }

      try {
        setWorkflow((current) => ({ ...current, loading: true, error: "" }));
        const incidentResponse = await api.incident(incidentId);
        const liveIncident = unwrapResponse(incidentResponse);
        const investigationResponse = includeInvestigation
          ? await api.investigate(incidentId, getPreferences().analysisMode)
          : null;
        const evidenceResponses = includeEvidence
          ? await Promise.all([
              api.logs(incidentId),
              api.metrics(incidentId),
              api.deployments(incidentId),
            ])
          : [];

        if (!cancelled) {
          setWorkflow({
            incident: liveIncident,
            investigation: unwrapResponse(investigationResponse) || liveIncident.recommendation || null,
            logs: includeEvidence ? unwrapResponse(evidenceResponses[0]) : [],
            metrics: includeEvidence ? unwrapResponse(evidenceResponses[1]) : [],
            deployments: includeEvidence ? unwrapResponse(evidenceResponses[2]) : [],
            loading: false,
            error: "",
          });
        }
      } catch (error) {
        if (!cancelled) {
          setWorkflow((current) => ({
            ...current,
            loading: false,
            error: error.message || "Failed to load incident workflow data.",
          }));
        }
      }
    }

    loadWorkflow();
    return () => {
      cancelled = true;
    };
  }, [incidentId, includeEvidence]);

  return { incidentId, ...workflow };
}
