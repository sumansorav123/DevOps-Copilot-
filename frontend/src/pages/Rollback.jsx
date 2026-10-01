import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useIncidentWorkflow } from "../hooks/useIncidentWorkflow";
import api from "../services/api";
import { goToWorkflow, unwrapResponse } from "../utils/incidentWorkflow";

function Rollback() {
  const navigate = useNavigate();
  const { incidentId, incident, investigation, loading, error } = useIncidentWorkflow();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [actionError, setActionError] = useState("");
  const deployment = investigation?.analysis?.deployments?.recent_deployment;
  const remediationAction = investigation?.recommended_action?.action;
  const approved = incident?.approval?.status === "approved";

  async function executeRollback() {
    setBusy(true);
    setActionError("");
    try {
      const envelope = await api.remediate({ incidentId, action: remediationAction, approved: true });
      const response = unwrapResponse(envelope);
      setResult({ ...response, success: envelope.success !== false });
      if (envelope.success === false) {
        setActionError(response.message || response.status || "Approval required.");
      }
    } catch (requestError) {
      setActionError(requestError.message || "Rollback failed.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || error || !incident) {
    return <div className="min-h-screen bg-[#0d1117] text-white"><Sidebar /><main className="p-8"><h1 className="text-3xl font-bold">Rollback</h1><p className="mt-4 text-gray-400">{loading ? "Loading rollback state..." : error || "Incident unavailable."}</p></main></div>;
  }

  const remediation = result?.remediation || result?.rollback || incident.remediation || incident.rollback;
  const remediationAllowed = approved && Boolean(remediationAction) && remediation?.status !== "completed";

  return (
    <div className="min-h-screen bg-[#0d1117] text-white"><div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8">
      <button onClick={() => goToWorkflow(navigate, "/approval", incidentId)} className="mb-5 text-sm text-gray-400 hover:text-white">← Back to Approval</button>
      <p className="text-xs text-gray-500">{incidentId} · {incident.service}</p>
      <h1 className="mt-2 text-3xl font-bold">{remediationAction === "rollback" ? "Rollback" : "Remediation"}</h1>
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Current Version</p><p className="mt-2 font-mono text-lg">{remediation?.from_version || deployment?.version || "Unavailable"}</p></div>
        <div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Target Version</p><p className="mt-2 font-mono text-lg">{remediationAction === "rollback" ? remediation?.to_version || deployment?.previous_version || "Unavailable" : "No version change"}</p></div>
      </section>
      <section className="mt-5 rounded-lg border border-[#252a31] bg-[#171b20] p-5">
        <p>Approval: <strong className="uppercase">{incident.approval?.status || "pending"}</strong></p>
        <p className="mt-2">Action: <strong className="uppercase">{remediationAction || "unavailable"}</strong></p>
        <p className="mt-2">Remediation status: <strong className="uppercase">{busy ? "running..." : remediation?.status || "not_started"}</strong></p>
        {result?.message && <p className="mt-3 text-sm text-gray-300">{result.message}</p>}
      </section>
      {actionError && <p role="alert" className="mt-5 text-sm text-red-400">{actionError}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {remediation?.status !== "completed" && <button disabled={busy || !remediationAllowed} onClick={executeRollback} className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-40">{busy ? "Executing..." : `Execute ${remediationAction || "Remediation"}`}</button>}
        {remediation?.status === "completed" && <button onClick={() => goToWorkflow(navigate, "/verification", incidentId)} className="rounded-md bg-green-400 px-5 py-3 text-sm font-semibold text-black">Continue to Verification →</button>}
        {!approved && <p className="self-center text-sm text-yellow-200">Remediation requires a persisted approved decision.</p>}
      </div>
    </main></div></div>
  );
}

export default Rollback;
