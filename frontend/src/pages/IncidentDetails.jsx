import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { goToWorkflow, rememberIncidentId } from "../utils/incidentWorkflow";

function IncidentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIncident = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.incident(id);

        // Handle either:
        // { ...incident }
        // or { incident: { ... } }
        const incidentData =
          data?.incident || data?.data || data;

        rememberIncidentId(id);
        setIncident(incidentData);
      } catch (err) {
        console.error("Failed to load incident:", err);

        setError(
          err.message || "Failed to load incident from the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadIncident();
    }
  }, [id]);

  const severityStyles = {
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    low: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="flex-1 p-8">
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-gray-400">
                Loading incident...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="flex-1 p-8">
            <h1 className="text-2xl font-bold">
              Failed to Load Incident
            </h1>

            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>

            <button
              onClick={() => navigate("/incidents")}
              className="mt-6 rounded-lg border border-[#30363d] bg-[#171b20] px-4 py-2 text-sm text-gray-200 transition hover:bg-[#1d2229]"
            >
              Back to Incidents
            </button>
          </main>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Incident Not Found
  // --------------------------------------------------

  if (!incident) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="flex-1 p-8">
            <h1 className="text-2xl font-bold">
              Incident Not Found
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              The requested incident could not be found.
            </p>

            <button
              onClick={() => navigate("/incidents")}
              className="mt-6 rounded-lg border border-[#30363d] bg-[#171b20] px-4 py-2 text-sm text-gray-200 transition hover:bg-[#1d2229]"
            >
              Back to Incidents
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">

          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/incidents")}
              className="mb-5 text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to Incidents
            </button>

            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {incident.id || incident.incident_id}
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                  {incident.title ||
                    incident.name ||
                    incident.incident_type ||
                    "Incident"}
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                  Review the incident information before beginning the
                  investigation.
                </p>
              </div>

              <span
                className={
                  "rounded-md border px-3 py-1.5 text-xs font-medium " +
                  (severityStyles[incident.severity?.toLowerCase()] || severityStyles.medium)
                }
              >
                {incident.severity || "Unknown"}
              </span>
            </div>
          </div>

          {/* Incident Information */}
          <div className="grid gap-6 md:grid-cols-2">

            {/* Service */}
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Service
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                {incident.service ||
                  incident.affected_service ||
                  "Unknown"}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />

                <p className="text-lg font-semibold text-white">
                  {incident.status || "Unknown"}
                </p>
              </div>
            </div>

            {/* Created */}
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Created
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                {incident.createdAt ||
                  incident.created_at ||
                  incident.timestamp ||
                  "Unknown"}
              </p>
            </div>

            {/* Incident ID */}
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Incident ID
              </p>

              <p className="mt-2 font-mono text-lg font-semibold text-white">
                {incident.id || incident.incident_id}
              </p>
            </div>
          </div>

          {/* Incident Type */}
          {(incident.type || incident.incident_type) && (
            <div className="mt-6 rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Incident Type
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                {incident.type || incident.incident_type}
              </p>
            </div>
          )}

          {/* Investigation */}
          <div className="mt-6 rounded-xl border border-green-900/40 bg-[#111817] p-6">
            <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-green-400">
                  Next Step
                </p>

                <h2 className="mt-2 text-lg font-semibold text-white">
                  Investigate Incident
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">
                  Analyze application logs, system metrics, and recent
                  deployments to identify the likely root cause.
                </p>
              </div>

              <button
                onClick={() =>
                  goToWorkflow(navigate, "/investigation", id)
                }
                className="shrink-0 rounded-lg bg-green-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-300"
              >
                Begin Investigation →
              </button>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default IncidentDetails;

