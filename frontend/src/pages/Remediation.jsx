import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useIncidentWorkflow } from "../hooks/useIncidentWorkflow";
import { goToWorkflow } from "../utils/incidentWorkflow";

function Remediation() {
  const navigate = useNavigate();
  const { incidentId, incident, investigation, loading, error } = useIncidentWorkflow();

  if (loading || error || !incident) {
    return <div className="min-h-screen bg-[#0d1117] text-white"><Sidebar /><main className="p-8"><h1 className="text-3xl font-bold">Remediation</h1><p className="mt-4 text-gray-400">{loading ? "Loading recommendation..." : error || "Incident unavailable."}</p></main></div>;
  }

  const recommendation = investigation?.recommendations?.join(" ") || "No recommendation was returned.";
  const recommendedAction = investigation?.recommended_action;
  const deployment = investigation?.analysis?.deployments?.recent_deployment;
  const action = recommendedAction?.action;
  const canProceed = action === "rollback"
    ? Boolean(deployment?.previous_version)
    : ["restart", "scale"].includes(action);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white"><div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8">
      <button onClick={() => goToWorkflow(navigate, "/root-cause", incidentId)} className="mb-5 text-sm text-gray-400 hover:text-white">← Back to Root Cause</button>
      <p className="text-xs text-gray-500">{incidentId} · {incident.service}</p>
      <h1 className="mt-2 text-3xl font-bold">Remediation</h1>
      <section className="mt-8 rounded-lg border border-[#252a31] bg-[#171b20] p-6">
        <p className="text-xs uppercase text-gray-500">Recommended Action</p>
        <p className="mt-3 text-lg">{action?.toUpperCase() || "No action"}</p>
        <p className="mt-2 text-sm text-gray-300">{recommendation}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div><p className="text-xs uppercase text-gray-500">Current Version</p><p className="mt-2 font-mono">{deployment?.version || "Unavailable"}</p></div>
          <div><p className="text-xs uppercase text-gray-500">Target Version</p><p className="mt-2 font-mono">{action === "rollback" ? deployment?.previous_version || "Unavailable" : "No version change"}</p></div>
        </div>
        {deployment?.commit && <p className="mt-4 text-sm text-gray-400">Commit: <span className="font-mono">{deployment.commit}</span></p>}
        {deployment?.changes?.length > 0 && <p className="mt-5 text-sm text-gray-400">Deployment changes: {deployment.changes.join(", ")}</p>}
        {!canProceed && <p className="mt-5 text-sm text-yellow-200">The live analysis did not return an executable action for this incident.</p>}
      </section>
      {investigation?.recommendations?.length > 0 && <section className="mt-6 rounded-lg border border-[#252a31] bg-[#171b20] p-6"><h2 className="font-semibold">Other Recommendations</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-300">{investigation.recommendations.map((item) => <li key={item}>{item}</li>)}</ul></section>}
      <button disabled={!canProceed} onClick={() => goToWorkflow(navigate, "/approval", incidentId)} className="mt-8 rounded-md bg-white px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40">Review & Approve →</button>
    </main></div></div>
  );
}

export default Remediation;
