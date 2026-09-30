import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { generatePostmortemPDF } from "../utils/generatePostmortemPDF";

function Postmortem() {
  const navigate = useNavigate();

  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);

  const postmortem = {
    incidentId: "INC-001",
    title: "High HTTP 500 Error Rate",
    service: "Payment API",
    severity: "Critical",
    status: "Resolved",

    timeline: [
      {
        step: "Incident Detected",
        time: "10:32 AM",
        detail: "HTTP 500 error rate increased significantly.",
      },
      {
        step: "Investigation",
        time: "10:35 AM",
        detail: "Logs, metrics, and deployment data were collected.",
      },
      {
        step: "Root Cause Identified",
        time: "10:39 AM",
        detail:
          "Recent deployment v1.4.2 was identified as the likely cause.",
      },
      {
        step: "Remediation Proposed",
        time: "10:41 AM",
        detail:
          "Rollback to the previous stable deployment was recommended.",
      },
      {
        step: "Human Approval",
        time: "10:43 AM",
        detail: "Authorized user approved the rollback.",
      },
      {
        step: "Rollback",
        time: "10:45 AM",
        detail: "Payment API was rolled back to v1.4.1.",
      },
      {
        step: "Verification",
        time: "10:48 AM",
        detail:
          "Health checks passed and the incident was considered resolved.",
      },
    ],

    rootCause:
      "The incident was strongly correlated with deployment v1.4.2. Application logs showed payment processing failures and database connection timeouts shortly after the deployment.",

    remediation:
      "Rollback deployment v1.4.2 to the previous stable version v1.4.1.",

    resolution:
      "The rollback restored the previous stable deployment. HTTP 500 errors decreased and payment processing returned to expected behavior.",

    lessons: [
      "Review deployment changes more carefully before production release.",
      "Monitor error-rate changes immediately after deployments.",
      "Maintain a reliable rollback path for critical services.",
    ],
  };

  // ---------------------------------------------------------
  // Report Actions
  // ---------------------------------------------------------

  const handleGenerateReport = () => {
    setReportGenerated(true);
    setReportSaved(false);
  };

  const handleSaveReport = () => {
    if (!reportGenerated) return;

    localStorage.setItem(
      `postmortem-${postmortem.incidentId}`,
      JSON.stringify({
        ...postmortem,
        generatedAt: new Date().toISOString(),
      })
    );

    setReportSaved(true);
  };

  const handleDownloadPDF = () => {
    if (!reportGenerated) return;

    generatePostmortemPDF(postmortem);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/verification")}
              className="mb-5 text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to Verification
            </button>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {postmortem.incidentId}
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                  Incident Postmortem
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                  Summary of the incident, root cause, remediation, and
                  resolution.
                </p>
              </div>

              <span className="w-fit rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
                {postmortem.status}
              </span>
            </div>
          </div>

          {/* Incident Summary */}
          <section className="mb-8">
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Incident
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                {postmortem.title}
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Incident ID
                  </p>

                  <p className="mt-2 font-mono text-sm text-gray-200">
                    {postmortem.incidentId}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Service
                  </p>

                  <p className="mt-2 text-sm text-gray-200">
                    {postmortem.service}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Severity
                  </p>

                  <span className="mt-2 inline-block rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
                    {postmortem.severity}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Incident Timeline */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Incident Timeline
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Key events throughout the incident response process.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <div className="space-y-6">
                {postmortem.timeline.map((event, index) => (
                  <div key={event.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-sm text-green-400">
                        ✓
                      </div>

                      {index !== postmortem.timeline.length - 1 && (
                        <div className="mt-2 h-full w-px bg-[#30363d]" />
                      )}
                    </div>

                    <div className="pb-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-sm font-semibold text-white">
                          {event.step}
                        </h3>

                        <span className="text-xs text-gray-500">
                          {event.time}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {event.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Root Cause */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Root Cause
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Summary of the identified cause.
              </p>
            </div>

            <div className="rounded-xl border border-yellow-500/20 bg-[#171b20] p-6">
              <p className="text-sm leading-6 text-gray-300">
                {postmortem.rootCause}
              </p>
            </div>
          </section>

          {/* Remediation */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Remediation
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Action taken to resolve the incident.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-sm leading-6 text-gray-300">
                {postmortem.remediation}
              </p>
            </div>
          </section>

          {/* Resolution */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Resolution
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Result of the remediation and verification process.
              </p>
            </div>

            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
                  ✓
                </div>

                <p className="text-sm leading-6 text-gray-300">
                  {postmortem.resolution}
                </p>
              </div>
            </div>
          </section>

          {/* Lessons Learned */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Lessons Learned
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Areas identified for improving future incident response.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <div className="space-y-3">
                {postmortem.lessons.map((lesson) => (
                  <div
                    key={lesson}
                    className="flex gap-3 rounded-lg border border-[#252a31] bg-[#0d1117] p-4"
                  >
                    <span className="text-blue-400">•</span>

                    <p className="text-sm text-gray-300">{lesson}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Report Generation */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Incident Report
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Generate, save, or download the completed incident
                postmortem report.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        reportGenerated
                          ? "bg-green-400"
                          : "bg-gray-600"
                      }`}
                    />

                    <p className="text-sm font-medium text-white">
                      {reportGenerated
                        ? "Report generated successfully"
                        : "Report is ready to generate"}
                    </p>
                  </div>

                  <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-500">
                    The report contains the incident summary, timeline,
                    root cause, remediation, resolution, and lessons learned.
                  </p>

                  {reportSaved && (
                    <p className="mt-3 text-xs font-medium text-green-400">
                      ✓ Report saved successfully
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Generate */}
                  <button
                    onClick={handleGenerateReport}
                    className="rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-300"
                  >
                    Generate Report
                  </button>

                  {/* Save */}
                  <button
                    onClick={handleSaveReport}
                    disabled={!reportGenerated}
                    className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition ${
                      reportGenerated
                        ? "border-[#30363d] bg-[#0d1117] text-gray-200 hover:bg-[#1d2229]"
                        : "cursor-not-allowed border-[#252a31] bg-[#0d1117] text-gray-600"
                    }`}
                  >
                    Save Report
                  </button>

                  {/* Download PDF */}
                  <button
                    onClick={handleDownloadPDF}
                    disabled={!reportGenerated}
                    className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition ${
                      reportGenerated
                        ? "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                        : "cursor-not-allowed border-[#252a31] bg-[#0d1117] text-gray-600"
                    }`}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Completion */}
          <section className="border-t border-[#252a31] pt-8">
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Incident Response Complete
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    Investigation, remediation, approval, rollback,
                    verification, and documentation have been completed.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/incidents")}
                  className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  Back to Incidents
                </button>
              </div>
            </div>
          </section>

          {/* Workflow */}
          <div className="mt-8 border-t border-[#252a31] pt-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-green-400">✓ Investigation</span>

              <span className="text-gray-600">→</span>

              <span className="text-green-400">✓ Root Cause</span>

              <span className="text-gray-600">→</span>

              <span className="text-green-400">✓ Remediation</span>

              <span className="text-gray-600">→</span>

              <span className="text-green-400">✓ Approval</span>

              <span className="text-gray-600">→</span>

              <span className="text-green-400">✓ Rollback</span>

              <span className="text-gray-600">→</span>

              <span className="text-green-400">✓ Verification</span>

              <span className="text-gray-600">→</span>

              <span className="text-blue-400">● Postmortem</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Postmortem;