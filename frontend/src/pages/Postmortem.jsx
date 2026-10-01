import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { generatePostmortemPDF } from "../utils/generatePostmortemPDF";
import { getActiveIncidentId, goToWorkflow, unwrapResponse } from "../utils/incidentWorkflow";

function Postmortem() {
  const navigate = useNavigate();
  const incidentId = getActiveIncidentId();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [reportError, setReportError] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!incidentId) {
      setReportError("No active incident.");
      setLoading(false);
      return undefined;
    }
    api.postmortem(incidentId)
      .then((response) => {
        if (!cancelled) {
          setReport(unwrapResponse(response));
          setLoading(false);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setReportError(requestError.message || "Postmortem could not be generated.");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [incidentId]);

  function saveReport() {
    if (!report) return;
    localStorage.setItem(`postmortem-${incidentId}`, JSON.stringify({ ...report, generatedAt: new Date().toISOString() }));
    setReportSaved(true);
  }

  function downloadReport() {
    if (!report) return;
    generatePostmortemPDF({
      incidentId: report.incident_id,
      title: report.title,
      service: report.service,
      severity: report.severity,
      status: report.resolution?.status || "not_verified",
      timeline: (report.timeline || []).map((event) => ({
        step: event.title || event.type || "Event",
        time: event.timestamp || "",
        detail: event.description || "",
      })),
      rootCause: report.root_cause || "Unavailable",
      remediation: [
        report.remediation?.action,
        ...(report.remediation?.action === "rollback"
          ? [
              report.remediation?.from_version && `from ${report.remediation.from_version}`,
              report.remediation?.to_version && `to ${report.remediation.to_version}`,
            ]
          : [report.remediation?.from_version && `on version ${report.remediation.from_version}`]),
        ...(report.corrective_actions || []),
      ].filter(Boolean).join("; ") || "No corrective actions returned.",
      resolution: report.resolution?.message || "Recovery has not been verified.",
      lessons: report.prevention_actions || [],
      verification: report.verification,
      approval: report.approval,
      evidence: report.evidence || [],
    });
  }

  if (loading || reportError || !report) {
    return <div className="min-h-screen bg-[#0d1117] text-white"><Sidebar /><main className="p-8"><h1 className="text-3xl font-bold">Incident Postmortem</h1><p className="mt-4 text-gray-400">{loading ? "Generating postmortem..." : reportError || "No active incident."}</p></main></div>;
  }

  const resolutionStatus = report.resolution?.status || "not_verified";
  const verificationStatus = report.verification?.status || "not_started";
  const remediationSummary = report.remediation?.action === "rollback"
    ? `Rollback ${report.remediation.from_version || "unknown"} → ${report.remediation.to_version || "unknown"}`
    : report.remediation?.action
      ? `${report.remediation.action} on ${report.remediation.from_version || report.remediation.to_version || report.service}`
      : "not recorded";

  return (
    <div className="min-h-screen bg-[#0d1117] text-white"><div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8">
      <button onClick={() => goToWorkflow(navigate, "/verification", incidentId)} className="mb-5 text-sm text-gray-400 hover:text-white">← Back to Verification</button>
      <p className="text-xs text-gray-500">{report.incident_id}</p>
      <h1 className="mt-2 text-3xl font-bold">Incident Postmortem</h1>
      <p className="mt-2 text-gray-300">{report.title}</p>
      <div className="mt-6 flex flex-wrap gap-5 text-sm text-gray-400"><span>Service: {report.service}</span><span>Severity: {report.severity}</span><span>Incident status: {report.status}</span></div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Verification</p><p className="mt-2 text-lg font-semibold uppercase">{verificationStatus}</p><p className="mt-2 text-sm text-gray-300">{report.verification?.message || "Verification has not been run."}</p>{report.verification?.metrics_after && <p className="mt-3 text-xs text-gray-400">After: error {report.verification.metrics_after.error_rate}%, latency {report.verification.metrics_after.latency_ms} ms, memory {report.verification.metrics_after.memory}%</p>}</div>
        <div className={`rounded-lg border p-5 ${resolutionStatus === "resolved" ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}><p className="text-xs uppercase text-gray-500">Resolution</p><p className="mt-2 text-lg font-semibold uppercase">{resolutionStatus === "not_verified" ? "Not verified" : resolutionStatus}</p><p className="mt-2 text-sm text-gray-300">{report.resolution?.message}</p></div>
      </section>

      <section className="mt-6 rounded-lg border border-[#252a31] bg-[#171b20] p-6"><h2 className="text-lg font-semibold">Summary and Impact</h2><p className="mt-3 text-sm text-gray-300">{report.summary}</p><p className="mt-3 text-sm text-gray-400">{report.impact}</p></section>
      <section className="mt-6 rounded-lg border border-[#252a31] bg-[#171b20] p-6"><h2 className="text-lg font-semibold">Root Cause</h2><p className="mt-3 text-sm text-gray-300">{report.root_cause || "No root cause was returned."}</p></section>
      <section className="mt-6 rounded-lg border border-[#252a31] bg-[#171b20] p-6"><h2 className="text-lg font-semibold">Evidence</h2>{report.evidence?.length ? <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-300">{report.evidence.map((item, index) => <li key={`${item.source}-${index}`}><strong>{item.source}:</strong> {item.finding}</li>)}</ul> : <p className="mt-3 text-sm text-gray-400">No evidence summary was returned.</p>}</section>
      <section className="mt-6 rounded-lg border border-[#252a31] bg-[#171b20] p-6"><h2 className="text-lg font-semibold">Approval and Remediation</h2><p className="mt-3 text-sm text-gray-300">Approval: {report.approval?.status || "not recorded"}{report.approval?.actor ? ` by ${report.approval.actor}` : ""}</p><p className="mt-2 text-sm text-gray-300">Action: {remediationSummary}</p></section>
      <section className="mt-6 rounded-lg border border-[#252a31] bg-[#171b20] p-6"><h2 className="text-lg font-semibold">Incident Timeline</h2>{report.timeline?.length ? <ol className="mt-4 space-y-4">{report.timeline.map((event, index) => <li key={`${event.timestamp}-${index}`} className="border-l border-[#3b424a] pl-4"><p className="text-xs text-gray-500">{event.timestamp} · {event.type}</p><p className="mt-1 text-sm font-medium">{event.title}</p><p className="mt-1 text-sm text-gray-400">{event.description}</p></li>)}</ol> : <p className="mt-3 text-sm text-gray-400">No timeline events were returned.</p>}</section>
      <section className="mt-6 grid gap-5 md:grid-cols-2"><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-6"><h2 className="font-semibold">Corrective Actions</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-300">{(report.corrective_actions || []).map((item) => <li key={item}>{item}</li>)}</ul></div><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-6"><h2 className="font-semibold">Prevention Actions</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-300">{(report.prevention_actions || []).map((item) => <li key={item}>{item}</li>)}</ul></div></section>

      <section className="mt-8 rounded-lg border border-[#252a31] bg-[#171b20] p-6"><h2 className="text-lg font-semibold">Incident Report</h2><p className="mt-2 text-sm text-gray-400">{reportGenerated ? "Export ready." : "Backend postmortem loaded."}</p>{reportSaved && <p className="mt-2 text-sm text-green-300">Saved in this browser.</p>}<div className="mt-5 flex flex-wrap gap-3"><button onClick={() => setReportGenerated(true)} className="rounded-md bg-green-400 px-4 py-2 text-sm font-semibold text-black">Prepare Export</button><button disabled={!reportGenerated} onClick={saveReport} className="rounded-md border border-[#444b53] px-4 py-2 text-sm disabled:opacity-40">Save Report</button><button disabled={!reportGenerated} onClick={downloadReport} className="rounded-md border border-[#444b53] px-4 py-2 text-sm disabled:opacity-40">Download PDF</button></div></section>
    </main></div></div>
  );
}

export default Postmortem;
