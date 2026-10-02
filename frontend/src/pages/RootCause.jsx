import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useIncidentWorkflow } from "../hooks/useIncidentWorkflow";
import { goToWorkflow } from "../utils/incidentWorkflow";

function RootCause() {
  const navigate = useNavigate();
  const { incidentId, incident, investigation, loading, error } = useIncidentWorkflow();

  if (loading || error || !incident) {
    return <div className="min-h-screen bg-[#0d1117] text-white"><Sidebar /><main className="p-8"><h1 className="text-3xl font-bold">Root Cause Analysis</h1><p className="mt-4 text-gray-400">{loading ? "Loading analysis..." : error || "Incident unavailable."}</p></main></div>;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8">
        <button onClick={() => goToWorkflow(navigate, "/investigation", incidentId)} className="mb-5 text-sm text-gray-400 hover:text-white">← Back to Investigation</button>
        <p className="text-xs text-gray-500">{incidentId} · {incident.service}</p>
        <h1 className="mt-2 text-3xl font-bold">Root Cause Analysis</h1>
        <section className="mt-8 rounded-lg border border-yellow-500/20 bg-[#171b20] p-6">
          <h2 className="text-xs uppercase text-gray-500">Likely Cause</h2>
          <p className="mt-3 text-lg text-white">{investigation?.root_cause || "No root cause was returned by the analysis."}</p>
          {investigation?.confidence != null && <p className="mt-3 text-sm text-gray-400">Confidence: {(investigation.confidence * 100).toFixed(0)}%</p>}
          <p className="mt-2 text-xs uppercase text-gray-500">Analysis engine: {investigation?.analysis_provider || "unavailable"}</p>
          {investigation?.analysis_notice && <p className="mt-2 text-sm text-yellow-200">{investigation.analysis_notice}</p>}
        </section>
        <section className="mt-6 rounded-lg border border-[#252a31] bg-[#171b20] p-6">
          <h2 className="text-lg font-semibold">Reasoning and Evidence</h2>
          {investigation?.analysis && <pre className="mt-4 overflow-auto whitespace-pre-wrap text-xs text-gray-300">{JSON.stringify(investigation.analysis, null, 2)}</pre>}
          {!investigation?.analysis && <p className="mt-3 text-sm text-gray-400">No detailed reasoning was returned.</p>}
          {investigation?.reasoning?.length > 0 && <div className="mt-4"><h3 className="text-sm font-semibold">Reasoning</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-300">{investigation.reasoning.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>}
          {investigation?.evidence?.length > 0 ? <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-300">{investigation.evidence.map((item, index) => <li key={`${item.source}-${index}`}><strong>{item.source}:</strong> {item.finding}</li>)}</ul> : <p className="mt-3 text-sm text-gray-400">No supporting evidence was returned.</p>}
          {investigation?.evidence_gaps?.length > 0 && <div className="mt-4"><h3 className="text-sm font-semibold text-yellow-200">Missing Evidence</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-yellow-100">{investigation.evidence_gaps.map((item) => <li key={item}>{item}</li>)}</ul></div>}
          {investigation?.conflicts?.length > 0 && <div className="mt-4"><h3 className="text-sm font-semibold text-orange-200">Conflicting Evidence</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-orange-100">{investigation.conflicts.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        </section>
        <section className="mt-6 rounded-lg border border-[#252a31] bg-[#171b20] p-6">
          <h2 className="text-lg font-semibold">Recommendations</h2>
          {investigation?.recommendations?.length ? <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-300">{investigation.recommendations.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-3 text-sm text-gray-400">No recommendation was returned.</p>}
        </section>
        <button onClick={() => goToWorkflow(navigate, "/remediation", incidentId)} className="mt-8 rounded-md bg-white px-5 py-3 text-sm font-semibold text-black">Review Remediation →</button>
      </main></div>
    </div>
  );
}

export default RootCause;
