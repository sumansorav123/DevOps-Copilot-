import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { getActiveIncidentId, unwrapResponse } from "../utils/incidentWorkflow";

function AuditLog() {
  const navigate = useNavigate();
  const incidentId = getActiveIncidentId();
  const [events, setEvents] = useState([]);
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!incidentId) {
      setError("No active incident is selected.");
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    Promise.all([api.incidentAudit(incidentId), api.incident(incidentId)])
      .then(([auditResponse, incidentResponse]) => {
        if (cancelled) return;
        setEvents(unwrapResponse(auditResponse) || []);
        setIncident(unwrapResponse(incidentResponse));
        setError("");
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || "Audit data unavailable.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [incidentId, refreshKey]);

  const humanEvents = events.filter((event) => event.actor && !["incident_agent", "remediation_service", "verification_service", "postmortem_service", "incident_simulator"].includes(event.actor));

  return (
    <div className="min-h-screen bg-[#0d1117] text-white"><div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">Audit Log</h1><p className="mt-2 text-sm text-gray-400">Persisted events for {incidentId || "the active incident"}{incident?.title ? ` · ${incident.title}` : ""}</p></div><div className="flex gap-3"><button disabled={!incidentId} onClick={() => { setError(""); setRefreshKey((key) => key + 1); }} className="rounded-md border border-[#30363d] px-4 py-2 text-sm disabled:opacity-40">Refresh</button>{incidentId && <button onClick={() => navigate(`/incidents/${incidentId}`)} className="rounded-md border border-[#30363d] px-4 py-2 text-sm">View Incident →</button>}</div></div>
      {loading && <p role="status" className="mt-6 text-sm text-gray-400">Loading audit events...</p>}
      {error && <p role="alert" className="mt-6 text-sm text-red-300">{error}</p>}
      {!loading && !error && <><div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Total Events</p><p className="mt-2 text-2xl">{events.length}</p></div><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Automated</p><p className="mt-2 text-2xl">{events.length - humanEvents.length}</p></div><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Human Decisions</p><p className="mt-2 text-2xl">{humanEvents.length}</p></div></div>
        {!events.length ? <p className="mt-8 text-sm text-gray-400">No audit events are recorded for this incident.</p> : <div className="mt-8 overflow-hidden rounded-lg border border-[#252a31] bg-[#171b20]"><div className="divide-y divide-[#252a31]">{events.map((event, index) => <article key={`${event.timestamp}-${event.event}-${index}`} className="grid gap-3 p-5 md:grid-cols-[1fr_1fr_2fr_1fr]"><div><p className="font-medium">{(event.event || event.type || "event").replaceAll("_", " ")}</p><p className="mt-1 text-xs text-gray-500">{incidentId}</p></div><p className="text-sm text-gray-300">{event.actor || "system"}</p><p className="text-sm text-gray-400">{event.detail || event.description || "No details recorded."}</p><p className="text-xs text-gray-500">{event.timestamp || "Timestamp unavailable"}</p></article>)}</div></div>}</>}
    </main></div></div>
  );
}

export default AuditLog;
