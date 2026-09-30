import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Rollback() {
  const navigate = useNavigate();

  const rollbackData = {
    incidentId: "INC-001",
    title: "High HTTP 500 Error Rate",
    service: "Payment API",
    currentVersion: "v1.4.2",
    targetVersion: "v1.4.1",
    currentCommit: "a83f91c",
    targetCommit: "7b21d4e",
  };

  const handleRollback = () => {
    navigate("/verification");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/approval")}
              className="mb-5 text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to Approval
            </button>

            <p className="text-xs font-medium text-gray-500">
              {rollbackData.incidentId}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Rollback
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Execute the approved deployment rollback and prepare the system
              for verification.
            </p>
          </div>

          {/* Approval Status */}
          <div className="mb-8 rounded-xl border border-green-500/20 bg-green-500/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
                ✓
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Rollback Approved
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Human approval has been received. The rollback is ready to
                  execute.
                </p>
              </div>
            </div>
          </div>

          {/* Incident Summary */}
          <div className="mb-8 rounded-xl border border-[#252a31] bg-[#171b20] p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Incident
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              {rollbackData.title}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Service: {rollbackData.service}
            </p>
          </div>

          {/* Deployment Change */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Deployment Change
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                The following deployment change will be simulated.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Current */}
              <div className="rounded-xl border border-red-500/20 bg-[#171b20] p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Current Deployment
                </p>

                <h3 className="mt-3 text-xl font-semibold text-red-400">
                  {rollbackData.currentVersion}
                </h3>

                <p className="mt-3 text-sm text-gray-400">
                  Commit
                </p>

                <p className="mt-1 font-mono text-sm text-gray-200">
                  {rollbackData.currentCommit}
                </p>
              </div>

              {/* Target */}
              <div className="rounded-xl border border-green-500/20 bg-[#171b20] p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Rollback Target
                </p>

                <h3 className="mt-3 text-xl font-semibold text-green-400">
                  {rollbackData.targetVersion}
                </h3>

                <p className="mt-3 text-sm text-gray-400">
                  Commit
                </p>

                <p className="mt-1 font-mono text-sm text-gray-200">
                  {rollbackData.targetCommit}
                </p>
              </div>
            </div>
          </section>

          {/* Rollback Steps */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Rollback Steps
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                The simulated rollback will follow these steps.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-xl border border-[#252a31] bg-[#171b20] p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d1117] text-sm text-gray-300">
                  1
                </span>

                <div>
                  <p className="text-sm font-medium text-white">
                    Stop current deployment
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Prepare the service for the rollback.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-[#252a31] bg-[#171b20] p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d1117] text-sm text-gray-300">
                  2
                </span>

                <div>
                  <p className="text-sm font-medium text-white">
                    Restore stable deployment
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Restore version {rollbackData.targetVersion}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-[#252a31] bg-[#171b20] p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d1117] text-sm text-gray-300">
                  3
                </span>

                <div>
                  <p className="text-sm font-medium text-white">
                    Start service
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Bring the Payment API back online.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-[#252a31] bg-[#171b20] p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d1117] text-sm text-gray-300">
                  4
                </span>

                <div>
                  <p className="text-sm font-medium text-white">
                    Verify system health
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Continue to verification after rollback.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Execute */}
          <section className="border-t border-[#252a31] pt-8">
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Execute Rollback
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
                    This prototype will simulate the rollback and move the
                    incident workflow to verification.
                  </p>
                </div>

                <button
                  onClick={handleRollback}
                  className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  Execute Rollback →
                </button>
              </div>
            </div>
          </section>

          {/* Workflow */}
          <div className="mt-8 border-t border-[#252a31] pt-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-green-400">
                ✓ Investigation
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-green-400">
                ✓ Root Cause
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-green-400">
                ✓ Remediation
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-green-400">
                ✓ Human Approval
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-blue-400">
                ● Rollback
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-gray-500">
                ○ Verification
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Rollback;