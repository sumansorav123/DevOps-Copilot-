import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useIncidentWorkflow } from "../hooks/useIncidentWorkflow";
import { goToWorkflow } from "../utils/incidentWorkflow";

function Investigation() {
  const navigate = useNavigate();
  const { incidentId, incident, investigation, logs, metrics, deployments, loading, error } =
    useIncidentWorkflow({ includeEvidence: true, includeInvestigation: true });

  if (loading || error || !incident) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <Sidebar />
        <main className="p-8">
          <h1 className="text-3xl font-bold">Investigation</h1>
          <p className="mt-4 text-gray-400">{loading ? "Loading incident evidence..." : error || "Incident unavailable."}</p>
        </main>
      </div>
    );
  }

  const analysis = investigation?.analysis || {};
  const serviceFixtureLogs = logs.filter((log) => log.incident_id !== incidentId);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <button onClick={() => navigate(`/incidents/${incidentId}`)} className="mb-5 text-sm text-gray-400 hover:text-white">← Back to Incident</button>
          <p className="text-xs text-gray-500">{incidentId} · {incident.service}</p>
          <h1 className="mt-2 text-3xl font-bold">Investigation</h1>
          <p className="mt-2 text-sm text-gray-400">{investigation?.summary || incident.description}</p>

          {serviceFixtureLogs.length > 0 && (
            <p className="mt-5 rounded-md border border-yellow-500/20 bg-yellow-500/5 p-3 text-sm text-yellow-200">
              No logs are assigned to this generated incident. Showing existing service-level fixture logs; source incident IDs are retained below.
            </p>
          )}

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <section className="rounded-lg border border-[#252a31] bg-[#171b20] p-5">
              <h2 className="text-lg font-semibold">Logs ({logs.length})</h2>
              {logs.length ? <div className="mt-4 space-y-3">{logs.map((log, index) => (
                <article key={`${log.timestamp}-${index}`} className="border-b border-[#30363d] pb-3">
                  <p className="text-xs text-gray-500">{log.timestamp} · {log.level} · source {log.incident_id}</p>
                  <p className="mt-1 text-sm text-gray-200">{log.message}</p>
                </article>
              ))}</div> : <p className="mt-4 text-sm text-gray-400">No log evidence available for this service.</p>}
            </section>

            <section className="rounded-lg border border-[#252a31] bg-[#171b20] p-5">
              <h2 className="text-lg font-semibold">Metrics ({metrics.length})</h2>
              {metrics.length ? <div className="mt-4 space-y-3">{metrics.map((metric, index) => (
                <article key={`${metric.timestamp}-${index}`} className="border-b border-[#30363d] pb-3 text-sm">
                  <p className="text-xs text-gray-500">{metric.timestamp}</p>
                  <p className="mt-1">Error {metric.error_rate}% · Latency {metric.latency_ms} ms</p>
                  <p className="text-gray-400">CPU {metric.cpu}% · Memory {metric.memory}%</p>
                </article>
              ))}</div> : <p className="mt-4 text-sm text-gray-400">No metrics available for this service.</p>}
            </section>

            <section className="rounded-lg border border-[#252a31] bg-[#171b20] p-5">
              <h2 className="text-lg font-semibold">Deployments ({deployments.length})</h2>
              {deployments.length ? <div className="mt-4 space-y-3">{deployments.map((deployment) => (
                <article key={deployment.id} className="border-b border-[#30363d] pb-3">
                  <p className="font-mono text-sm">{deployment.version} → {deployment.previous_version || "no prior version"}</p>
                  <p className="mt-1 text-xs text-gray-500">{deployment.deployed_at} · {deployment.status}</p>
                  <p className="mt-1 font-mono text-xs text-gray-400">Commit: {deployment.commit || "Unavailable"}</p>
                  <p className="mt-1 text-sm text-gray-300">{(deployment.changes || []).join(", ")}</p>
                </article>
              ))}</div> : <p className="mt-4 text-sm text-gray-400">No deployment evidence available for this service.</p>}
            </section>
          </div>

          <section className="mt-8 rounded-lg border border-[#252a31] bg-[#171b20] p-5">
            <h2 className="text-lg font-semibold">Analysis</h2>
            <p className="mt-2 text-xs uppercase text-gray-500">Analysis engine: {investigation?.analysis_provider || "unavailable"}</p>
            {investigation?.analysis_notice && <p className="mt-2 text-sm text-yellow-200">{investigation.analysis_notice}</p>}
            <p className="mt-2 text-sm text-gray-300">{investigation?.root_cause || "No root-cause analysis was returned."}</p>
            {investigation?.confidence != null && <p className="mt-2 text-sm text-gray-400">Confidence: {(investigation.confidence * 100).toFixed(0)}%</p>}
            {!investigation?.evidence?.length && <p className="mt-2 text-sm text-gray-500">No supporting evidence was returned.</p>}
            {!!investigation?.evidence?.length && <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-300">{investigation.evidence.map((item, index) => <li key={`${item.source}-${index}`}><strong>{item.source}:</strong> {item.finding}</li>)}</ul>}
            {!!investigation?.evidence_gaps?.length && <div className="mt-4"><h3 className="text-sm font-semibold text-yellow-200">Missing Evidence</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-yellow-100">{investigation.evidence_gaps.map((item) => <li key={item}>{item}</li>)}</ul></div>}
            {!!investigation?.conflicts?.length && <div className="mt-4"><h3 className="text-sm font-semibold text-orange-200">Conflicting Signals</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-orange-100">{investigation.conflicts.map((item) => <li key={item}>{item}</li>)}</ul></div>}
          </section>

          <button onClick={() => goToWorkflow(navigate, "/root-cause", incidentId)} className="mt-8 rounded-md bg-white px-5 py-3 text-sm font-semibold text-black">Continue to Root Cause →</button>
        </main>
      </div>
    </div>
  );
}

export default Investigation;
