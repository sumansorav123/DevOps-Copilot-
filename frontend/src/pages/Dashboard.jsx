import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { unwrapResponse } from "../utils/incidentWorkflow";

function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api.dashboard()
      .then((response) => {
        if (!cancelled) setSummary(unwrapResponse(response));
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || "Dashboard data unavailable.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const stats = [
    ["Total Incidents", summary?.total_incidents],
    ["Active Incidents", summary?.active_incidents],
    ["Critical Incidents", summary?.critical_incidents],
    ["Resolved Incidents", summary?.resolved_incidents],
    ["Services Affected", summary?.services_affected],
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white"><div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">Overview</h1><p className="mt-2 text-sm text-gray-400">System overview and active incident health</p></div><button onClick={() => { setLoading(true); setError(""); setRefreshKey((key) => key + 1); }} className="rounded-md border border-[#30363d] px-4 py-2 text-sm">Refresh</button></div>
      <div className="mb-6 rounded-xl border border-green-900/50 bg-[#111817] p-6"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-center"><div><p className="text-xs font-semibold uppercase tracking-wider text-green-400">Incident Response</p><h2 className="mt-3 text-xl font-semibold">Simulate a New Incident</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">Create a controlled software incident and start investigation using simulated logs, metrics, and deployment evidence.</p></div><button onClick={() => navigate("/incident-simulator")} className="shrink-0 rounded-lg bg-green-400 px-6 py-3 text-sm font-semibold text-black">Simulate Incident →</button></div></div>
      {loading && <p role="status" className="mb-5 text-sm text-gray-400">Loading dashboard...</p>}
      {error && <div role="alert" className="mb-5 rounded-md border border-red-500/30 p-4 text-sm text-red-300">{error}<button onClick={() => { setLoading(true); setError(""); setRefreshKey((key) => key + 1); }} className="ml-3 underline">Retry</button></div>}
      {!loading && !error && summary && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{stats.map(([label, value]) => <div key={label} className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase tracking-wider text-gray-500">{label}</p><p className="mt-3 text-2xl font-semibold">{value ?? 0}</p></div>)}</div>}
    </main></div></div>
  );
}

export default Dashboard;
