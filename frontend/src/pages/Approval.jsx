import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useIncidentWorkflow } from "../hooks/useIncidentWorkflow";
import api from "../services/api";
import { goToWorkflow, unwrapResponse } from "../utils/incidentWorkflow";

function Approval() {
  const navigate = useNavigate();
  const { incidentId, incident, investigation, loading, error } = useIncidentWorkflow();
  const [decision, setDecision] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const recommendation = investigation?.recommendations?.join(" ") || "No recommendation was returned.";
  const recommendedAction = investigation?.recommended_action;
  const deployment = investigation?.analysis?.deployments?.recent_deployment;
  const approvalStatus = decision || incident?.approval?.status;

  async function submitDecision(value) {
    setBusy(true);
    setActionError("");
    try {
      const response = unwrapResponse(await api.approve(incidentId, value));
      setDecision(response.decision);
    } catch (requestError) {
      setActionError(requestError.message || "Approval could not be recorded.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || error || !incident) {
    return <div className="min-h-screen bg-[#0d1117] text-white"><Sidebar /><main className="p-8"><h1 className="text-3xl font-bold">Human Approval</h1><p className="mt-4 text-gray-400">{loading ? "Loading approval details..." : error || "Incident unavailable."}</p></main></div>;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white"><div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8">
      <button onClick={() => goToWorkflow(navigate, "/remediation", incidentId)} className="mb-5 text-sm text-gray-400 hover:text-white">← Back to Remediation</button>
      <p className="text-xs text-gray-500">{incidentId} · {incident.service}</p>
      <h1 className="mt-2 text-3xl font-bold">Human Approval</h1>
      <section className="mt-8 rounded-lg border border-[#252a31] bg-[#171b20] p-6">
        <h2 className="text-lg font-semibold">Proposed Action</h2>
        <p className="mt-3 text-sm uppercase text-gray-400">Action: {recommendedAction?.action || "none"}</p>
        <p className="mt-2 text-gray-300">{recommendation}</p>
        <p className="mt-4 text-sm text-gray-400">Current version: {deployment?.version || "Unavailable"} · Target version: {recommendedAction?.action === "rollback" ? deployment?.previous_version || "Unavailable" : "No version change"}</p>
        {deployment?.commit && <p className="mt-2 text-sm text-gray-400">Commit: <span className="font-mono">{deployment.commit}</span></p>}
        <p className="mt-4 text-sm">Approval status: <strong className="uppercase">{approvalStatus || "pending"}</strong></p>
      </section>
      {actionError && <p role="alert" className="mt-5 text-sm text-red-400">{actionError}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <button disabled={busy || ["approved", "rejected"].includes(approvalStatus)} onClick={() => submitDecision("rejected")} className="rounded-md border border-red-500/40 px-5 py-3 text-sm text-red-300 disabled:opacity-40">{busy ? "Saving..." : "Reject"}</button>
        <button disabled={busy || ["approved", "rejected"].includes(approvalStatus)} onClick={() => submitDecision("approved")} className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-40">{busy ? "Saving..." : "Approve"}</button>
        {approvalStatus === "approved" && <button onClick={() => goToWorkflow(navigate, "/rollback", incidentId)} className="rounded-md bg-green-400 px-5 py-3 text-sm font-semibold text-black">Continue to Remediation →</button>}
        {approvalStatus === "rejected" && <button onClick={() => goToWorkflow(navigate, "/root-cause", incidentId)} className="rounded-md border border-[#30363d] px-5 py-3 text-sm">Return to Root Cause</button>}
      </div>
    </main></div></div>
  );
}

export default Approval;
