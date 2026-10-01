import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useIncidentWorkflow } from "../hooks/useIncidentWorkflow";
import api from "../services/api";
import { goToWorkflow, unwrapResponse } from "../utils/incidentWorkflow";

function Verification() {
  const navigate = useNavigate();
  const { incidentId, incident, loading, error } = useIncidentWorkflow();
  const [verification, setVerification] = useState(null);
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!incidentId) return undefined;
    api.verification(incidentId)
      .then((response) => {
        if (!cancelled) setVerification(unwrapResponse(response));
      })
      .catch((requestError) => {
        if (!cancelled) setVerificationError(requestError.message || "Verification could not be loaded.");
      });
    return () => { cancelled = true; };
  }, [incidentId]);

  if (loading || error || !incident || (!verification && !verificationError)) {
    const message = loading
      ? "Loading verification..."
      : error || verificationError || "Loading verification...";
    return <div className="min-h-screen bg-[#0d1117] text-white"><Sidebar /><main className="p-8"><h1 className="text-3xl font-bold">Verification</h1><p className="mt-4 text-gray-400">{message}</p></main></div>;
  }

  const passed = verification?.status === "passed";
  const after = verification?.metrics_after;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white"><div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8">
      <button onClick={() => goToWorkflow(navigate, "/rollback", incidentId)} className="mb-5 text-sm text-gray-400 hover:text-white">← Back to Remediation</button>
      <p className="text-xs text-gray-500">{incidentId} · {incident.service}</p>
      <h1 className="mt-2 text-3xl font-bold">Verification</h1>
      {verificationError ? <p role="alert" className="mt-5 text-red-400">{verificationError}</p> : <>
        <section className={`mt-8 rounded-lg border p-6 ${passed ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
          <h2 className="text-xl font-semibold">{verification?.status === "not_started" ? "Not Started" : `Verification ${verification?.status?.toUpperCase() || "UNAVAILABLE"}`}</h2>
          <p className="mt-2 text-gray-300">{verification?.message || "No verification result was returned."}</p>
        </section>
        <section className="mt-6 rounded-lg border border-[#252a31] bg-[#171b20] p-6">
          <h2 className="text-lg font-semibold">Post-Remediation Metrics</h2>
          {after ? <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Version", after.version], ["Error rate", `${after.error_rate}%`], ["Latency", `${after.latency_ms} ms`], ["Memory", `${after.memory}%`]].map(([label, value]) => <div key={label}><dt className="text-xs uppercase text-gray-500">{label}</dt><dd className="mt-1 font-mono">{value ?? "Unavailable"}</dd></div>)}</dl> : <p className="mt-3 text-sm text-gray-400">No post-rollback metric sample is available.</p>}
          {verification?.comparison && <pre className="mt-5 overflow-auto whitespace-pre-wrap text-xs text-gray-400">{JSON.stringify(verification.comparison, null, 2)}</pre>}
        </section>
        <section className="mt-6 rounded-lg border border-[#252a31] bg-[#171b20] p-6">
          <p className="text-xs uppercase text-gray-500">Resolution</p>
          <h2 className="mt-2 text-xl font-semibold">{passed ? "Resolved" : "Not verified / unresolved"}</h2>
          <p className="mt-2 text-sm text-gray-400">{passed ? "The post-remediation metrics satisfy the configured health thresholds." : "The incident remains open for further investigation."}</p>
        </section>
        <button onClick={() => goToWorkflow(navigate, "/postmortem", incidentId)} className="mt-8 rounded-md bg-white px-5 py-3 text-sm font-semibold text-black">Generate Postmortem →</button>
      </>}
    </main></div></div>
  );
}

export default Verification;
