import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Verification() {
  const navigate = useNavigate();

  const verificationData = {
    incidentId: "INC-001",
    title: "High HTTP 500 Error Rate",
    service: "Payment API",
    previousVersion: "v1.4.2",
    currentVersion: "v1.4.1",
  };

  const checks = [
    {
      name: "Deployment Status",
      status: "Passed",
      detail: "Rollback completed successfully.",
    },
    {
      name: "HTTP 500 Error Rate",
      status: "Passed",
      detail: "Error rate returned to normal levels.",
    },
    {
      name: "Payment Processing",
      status: "Passed",
      detail: "Payment requests are processing successfully.",
    },
    {
      name: "System Health",
      status: "Passed",
      detail: "CPU and memory usage are within expected range.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/rollback")}
              className="mb-5 text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to Rollback
            </button>

            <p className="text-xs font-medium text-gray-500">
              {verificationData.incidentId}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Verification
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Verify that the rollback restored the affected service and
              resolved the incident.
            </p>
          </div>

          {/* Verification Status */}
          <div className="mb-8 rounded-xl border border-green-500/20 bg-green-500/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
                ✓
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Verification Passed
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  The rollback appears to have restored the Payment API to a
                  healthy state.
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
              {verificationData.title}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Service: {verificationData.service}
            </p>
          </div>

          {/* Deployment Result */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Deployment Result
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                The deployment version before and after the rollback.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-red-500/20 bg-[#171b20] p-6">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Previous Version
                </p>

                <p className="mt-3 font-mono text-xl text-red-400">
                  {verificationData.previousVersion}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Version associated with the incident.
                </p>
              </div>

              <div className="rounded-xl border border-green-500/20 bg-[#171b20] p-6">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Active Version
                </p>

                <p className="mt-3 font-mono text-xl text-green-400">
                  {verificationData.currentVersion}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Previous stable deployment restored.
                </p>
              </div>
            </div>
          </section>

          {/* Health Checks */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Health Checks
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Verification results collected after the rollback.
              </p>
            </div>

            <div className="space-y-3">
              {checks.map((check) => (
                <div
                  key={check.name}
                  className="flex flex-col gap-4 rounded-xl border border-[#252a31] bg-[#171b20] p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {check.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {check.detail}
                    </p>
                  </div>

                  <span className="w-fit rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
                    ✓ {check.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Resolution Summary */}
          <section className="mb-8">
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Resolution Summary
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Incident appears resolved
              </h2>

              <p className="mt-3 max-w-4xl text-sm leading-6 text-gray-400">
                The affected service was rolled back to the previous stable
                deployment. Error rates and payment processing have returned
                to expected behavior based on the simulated verification
                checks.
              </p>
            </div>
          </section>

          {/* Continue */}
          <section className="border-t border-[#252a31] pt-8">
            <div className="flex flex-col gap-6 rounded-xl border border-[#252a31] bg-[#171b20] p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Generate Postmortem
                </h2>

                <p className="mt-2 max-w-3xl text-sm text-gray-400">
                  Verification is complete. Continue to generate a summary of
                  the incident, investigation, remediation, and resolution.
                </p>
              </div>

              <button
                onClick={() => navigate("/postmortem")}
                className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                Continue to Postmortem →
              </button>
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
                ✓ Approval
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-green-400">
                ✓ Rollback
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-blue-400">
                ● Verification
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-gray-500">
                ○ Postmortem
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Verification;