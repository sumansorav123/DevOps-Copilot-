import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Overview
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              System overview and active incident health
            </p>
          </div>

          {/* Incident Simulator CTA */}
          <div className="mb-6 rounded-xl border border-green-900/50 bg-[#111817] p-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-green-400">
                  Incident Response
                </p>

                <h2 className="mt-3 text-xl font-semibold">
                  Simulate a New Incident
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                  Create a controlled software incident and start the
                  investigation workflow using simulated logs, metrics,
                  and deployment evidence.
                </p>
              </div>

              <button
                onClick={() => navigate("/incident-simulator")}
                className="shrink-0 rounded-lg bg-green-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-green-300"
              >
                Simulate Incident →
              </button>

            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Current View
              </p>

              <h2 className="mt-5 text-xl font-semibold">
                Incident Response Workspace
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Monitor incidents and move through the investigation,
                root-cause analysis, remediation, verification, and
                postmortem workflow.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Workflow
              </p>

              <h2 className="mt-5 text-xl font-semibold">
                Investigate → Explain → Act
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Start with a simulated incident, investigate the available
                evidence, review the recommended action, and continue
                through verification and documentation.
              </p>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;