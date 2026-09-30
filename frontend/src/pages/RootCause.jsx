import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function RootCause() {
  const navigate = useNavigate();

  // Simulated AI analysis data.
  // This will later come from the backend/AI agent.
  const analysis = {
    incidentId: "INC-001",
    title: "High HTTP 500 Error Rate",
    service: "Payment API",
    severity: "Critical",

    rootCause: {
      title: "Recent deployment introduced a payment processing failure",
      confidence: "High",
      description:
        "The incident closely correlates with the latest deployment. Error rates increased shortly after version v1.4.2 was deployed, while application logs show payment processing failures and database connection timeouts.",
    },

    evidence: [
      {
        label: "Error Pattern",
        value: "HTTP 500 responses increased significantly.",
      },
      {
        label: "Deployment Timing",
        value: "v1.4.2 was deployed 8 minutes before the incident.",
      },
      {
        label: "Application Logs",
        value: "Payment processing failures and database connection timeouts detected.",
      },
      {
        label: "System Metrics",
        value: "Error rate increased to 18.4% during the incident.",
      },
    ],

    recommendation: {
      action: "Rollback deployment v1.4.2",
      reason:
        "Rolling back the recent deployment is recommended because the incident timing and available evidence strongly correlate with the deployment.",
    },
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/investigation")}
              className="mb-5 text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to Investigation
            </button>

            <p className="text-xs font-medium text-gray-500">
              {analysis.incidentId}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Root Cause Analysis
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Review the evidence collected during the investigation and
              understand the likely cause of the incident.
            </p>
          </div>

          {/* Incident Summary */}
          <div className="mb-8 rounded-xl border border-[#252a31] bg-[#171b20] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Incident
                </p>

                <h2 className="mt-2 text-xl font-semibold text-white">
                  {analysis.title}
                </h2>
              </div>

              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Service
                  </p>

                  <p className="mt-1 text-sm text-gray-200">
                    {analysis.service}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Severity
                  </p>

                  <span className="mt-1 inline-block rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
                    {analysis.severity}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Result */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Analysis Result
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                AI-generated assessment based on the available evidence.
              </p>
            </div>

            <div className="rounded-xl border border-yellow-500/20 bg-[#171b20] p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Likely Root Cause
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {analysis.rootCause.title}
                  </h3>
                </div>

                <span className="w-fit rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
                  {analysis.rootCause.confidence} Confidence
                </span>
              </div>

              <p className="mt-5 max-w-4xl text-sm leading-6 text-gray-300">
                {analysis.rootCause.description}
              </p>
            </div>
          </section>

          {/* Evidence */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Supporting Evidence
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Evidence used to support the root-cause assessment.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {analysis.evidence.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#252a31] bg-[#171b20] p-5"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {item.label}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-300">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendation */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Recommended Action
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Suggested remediation based on the current analysis.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Recommended Remediation
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {analysis.recommendation.action}
                  </h3>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                    {analysis.recommendation.reason}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/remediation")}
                  className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  Review Remediation →
                </button>
              </div>
            </div>
          </section>

          {/* Workflow Status */}
          <div className="border-t border-[#252a31] pt-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-green-400">
                ✓ Investigation complete
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-blue-400">
                ● Root cause identified
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-gray-500">
                ○ Human approval
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RootCause;