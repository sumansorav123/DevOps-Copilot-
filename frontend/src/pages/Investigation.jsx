import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Investigation() {
  const navigate = useNavigate();

  // Simulated data for the UI prototype.
  // This will later be replaced with data from the backend/AI agent.
  const investigationData = {
    incidentId: "INC-001",
    title: "High HTTP 500 Error Rate",
    service: "Payment API",
    severity: "Critical",
    status: "Investigating",

    logs: {
      status: "Available",
      patterns: [
        "HTTP 500 responses increasing",
        "Payment processing failed",
        "Database connection timeout",
      ],
    },

    metrics: {
      status: "Available",
      data: [
        {
          label: "Error Rate",
          value: "18.4%",
        },
        {
          label: "CPU Usage",
          value: "72%",
        },
        {
          label: "Memory Usage",
          value: "84%",
        },
      ],
      summary:
        "Error rate increased significantly during the incident.",
    },

    deployment: {
      status: "Available",
      version: "v1.4.2",
      commit: "a83f91c",
      deployed: "8 minutes before incident",
      summary: "Potential correlation detected.",
    },
  };

  const severityStyles = {
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Low: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/incidents/INC-001")}
              className="mb-5 text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to Incident
            </button>

            <h1 className="text-3xl font-bold tracking-tight">
              Investigation
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Analyze logs, metrics, and recent deployments to identify
              evidence related to the incident.
            </p>
          </div>

          {/* Incident Summary */}
          <div className="mb-8 rounded-xl border border-[#252a31] bg-[#171b20] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {investigationData.incidentId}
                </p>

                <h2 className="mt-2 text-xl font-semibold text-white">
                  {investigationData.title}
                </h2>
              </div>

              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Service
                  </p>

                  <p className="mt-1 text-sm text-gray-200">
                    {investigationData.service}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Severity
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-md border px-2.5 py-1 text-xs font-medium ${
                      severityStyles[investigationData.severity] ||
                      severityStyles.Medium
                    }`}
                  >
                    {investigationData.severity}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Status
                  </p>

                  <p className="mt-1 text-sm text-blue-400">
                    {investigationData.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">
                Evidence
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Information collected from the affected service.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {/* Logs */}
              <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Evidence Source
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-white">
                      Application Logs
                    </h3>
                  </div>

                  <span className="rounded-md border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                    {investigationData.logs.status}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-sm text-gray-400">
                    Recent error patterns detected:
                  </p>

                  <div className="space-y-2">
                    {investigationData.logs.patterns.map(
                      (pattern) => (
                        <div
                          key={pattern}
                          className="rounded-lg border border-[#252a31] bg-[#0d1117] px-3 py-2.5 text-sm text-gray-300"
                        >
                          <span className="mr-2 text-red-400">
                            •
                          </span>
                          {pattern}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Evidence Source
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-white">
                      System Metrics
                    </h3>
                  </div>

                  <span className="rounded-md border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                    {investigationData.metrics.status}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {investigationData.metrics.data.map(
                    (metric) => (
                      <div
                        key={metric.label}
                        className="flex items-center justify-between border-b border-[#252a31] pb-3"
                      >
                        <span className="text-sm text-gray-400">
                          {metric.label}
                        </span>

                        <span className="font-mono text-sm font-medium text-gray-200">
                          {metric.value}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <p className="mt-5 border-t border-[#252a31] pt-4 text-sm text-gray-400">
                  {investigationData.metrics.summary}
                </p>
              </div>

              {/* Deployment */}
              <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Evidence Source
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-white">
                      Recent Deployment
                    </h3>
                  </div>

                  <span className="rounded-md border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                    {investigationData.deployment.status}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#252a31] pb-3">
                    <span className="text-sm text-gray-400">
                      Version
                    </span>

                    <span className="rounded bg-[#0d1117] px-2 py-1 font-mono text-sm text-gray-200">
                      {investigationData.deployment.version}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#252a31] pb-3">
                    <span className="text-sm text-gray-400">
                      Commit
                    </span>

                    <span className="font-mono text-sm text-gray-200">
                      {investigationData.deployment.commit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Deployed
                    </span>

                    <span className="text-sm text-gray-200">
                      {investigationData.deployment.deployed}
                    </span>
                  </div>
                </div>

                <p className="mt-5 border-t border-[#252a31] pt-4 text-sm text-yellow-400">
                  {investigationData.deployment.summary}
                </p>
              </div>
            </div>
          </section>

          {/* Investigation Progress */}
          <section className="mt-10 border-t border-[#252a31] pt-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Investigation Progress
                </h2>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-green-400">✓</span>
                    Incident identified
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-green-400">✓</span>
                    Logs collected
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-green-400">✓</span>
                    Metrics collected
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-green-400">✓</span>
                    Deployment data collected
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>○</span>
                    Root cause analysis
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/root-cause")}
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                Continue to Root Cause →
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Investigation;