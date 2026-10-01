import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { unwrapResponse } from "../utils/incidentWorkflow";

function Deployments() {
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.allDeployments()
      .then((response) => {
        if (!cancelled) setDeployments(unwrapResponse(response) || []);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || "Deployment data unavailable.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const failedCount = deployments.filter((item) => ["failed", "degraded"].includes(item.status)).length;
  const successfulCount = deployments.filter((item) => item.status === "successful").length;
  const latestFailure = deployments.find((item) => ["failed", "degraded"].includes(item.status));

  return (
    <div className="min-h-screen bg-[#0d1117] text-white"><div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8">
      <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
      <p className="mt-2 text-sm text-gray-400">Deployment and commit evidence from the simulated repository.</p>
      {loading && <p role="status" className="mt-6 text-sm text-gray-400">Loading deployments...</p>}
      {error && <p role="alert" className="mt-6 text-sm text-red-300">{error}</p>}
      {!loading && !error && <>
        <div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Deployments</p><p className="mt-2 text-2xl">{deployments.length}</p></div><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Successful</p><p className="mt-2 text-2xl text-green-300">{successfulCount}</p></div><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Failed / Degraded</p><p className="mt-2 text-2xl text-red-300">{failedCount}</p></div></div>
        {!deployments.length && <p className="mt-6 text-sm text-gray-400">No deployment fixtures are available.</p>}
        <div className="mt-8 space-y-4">{deployments.map((deployment) => <article key={deployment.id} className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-xs text-gray-500">{deployment.id}</p><h2 className="mt-1 text-lg font-semibold">{deployment.service} · {deployment.version}</h2></div><span className="rounded border border-[#444b53] px-2 py-1 text-xs uppercase">{deployment.status}</span></div><dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div><dt className="text-xs uppercase text-gray-500">Previous</dt><dd className="mt-1 font-mono">{deployment.previous_version || "Unavailable"}</dd></div><div><dt className="text-xs uppercase text-gray-500">Commit</dt><dd className="mt-1 font-mono">{deployment.commit || "Unavailable"}</dd></div><div><dt className="text-xs uppercase text-gray-500">Deployed</dt><dd className="mt-1 text-sm">{deployment.deployed_at}</dd></div><div><dt className="text-xs uppercase text-gray-500">Incident</dt><dd className="mt-1">{deployment.incident_id || "Not associated"}</dd></div></dl><p className="mt-4 text-sm text-gray-400">{(deployment.changes || []).join("; ") || "No change summary available."}</p>{deployment.incident_id && <button onClick={() => navigate(`/incidents/${deployment.incident_id}`)} className="mt-4 text-sm text-blue-300">Open associated incident →</button>}</article>)}</div>
        {latestFailure && <section className="mt-8 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-5"><h2 className="font-semibold">Latest failed deployment</h2><p className="mt-2 text-sm text-gray-300">{latestFailure.id} deployed {latestFailure.version} of {latestFailure.service}; previous version {latestFailure.previous_version || "unavailable"}; commit {latestFailure.commit || "unavailable"}.</p></section>}
      </>}
    </main></div></div>
  );
}

export default Deployments;
