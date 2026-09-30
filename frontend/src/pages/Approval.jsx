import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Approval() {
  const navigate = useNavigate();

  const approvalData = {
    incidentId: "INC-001",
    title: "High HTTP 500 Error Rate",
    service: "Payment API",
    severity: "Critical",

    remediation: {
      action: "Rollback Deployment",
      deployment: "v1.4.2",
      commit: "a83f91c",
      reason:
        "The recent deployment is strongly correlated with the incident. Rolling back to the previous stable version is recommended to restore the Payment API.",
    },

    risk: "Low",

    impact:
      "The rollback is expected to reduce HTTP 500 errors and restore normal payment processing.",
  };

  const handleApprove = () => {
    navigate("/rollback");
  };

  const handleReject = () => {
    navigate("/root-cause");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/remediation")}
              className="mb-5 text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to Remediation
            </button>

            <p className="text-xs font-medium text-gray-500">
              {approvalData.incidentId}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Human Approval
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Review the proposed remediation and approve or reject the
              action.
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
                  {approvalData.title}
                </h2>
              </div>

              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Service
                  </p>

                  <p className="mt-1 text-sm text-gray-200">
                    {approvalData.service}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Severity
                  </p>

                  <span className="mt-1 inline-block rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
                    {approvalData.severity}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Notice */}
          <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400">
                !
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Approval Required
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  The AI agent has identified a remediation action, but it
                  cannot execute the change without human approval.
                </p>
              </div>
            </div>
          </div>

          {/* Proposed Action */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Proposed Action
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Review the action before authorizing execution.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Remediation Type
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {approvalData.remediation.action}
                  </h3>
                </div>

                <span className="w-fit rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
                  {approvalData.risk} Risk
                </span>
              </div>

              <div className="mt-6 grid gap-4 border-t border-[#252a31] pt-6 md:grid-cols-2">
                <div className="rounded-lg border border-[#252a31] bg-[#0d1117] p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Deployment
                  </p>

                  <p className="mt-2 font-mono text-lg text-gray-200">
                    {approvalData.remediation.deployment}
                  </p>
                </div>

                <div className="rounded-lg border border-[#252a31] bg-[#0d1117] p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Commit
                  </p>

                  <p className="mt-2 font-mono text-lg text-gray-200">
                    {approvalData.remediation.commit}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-[#252a31] pt-6">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Reason
                </p>

                <p className="mt-3 max-w-4xl text-sm leading-6 text-gray-300">
                  {approvalData.remediation.reason}
                </p>
              </div>
            </div>
          </section>

          {/* Expected Impact */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Expected Impact
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                What is expected after the remediation is executed.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-sm leading-6 text-gray-300">
                {approvalData.impact}
              </p>
            </div>
          </section>

          {/* Decision */}
          <section className="border-t border-[#252a31] pt-8">
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <h2 className="text-lg font-semibold text-white">
                Approval Decision
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Choose whether the AI agent should proceed with the proposed
                rollback.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={handleReject}
                  className="rounded-lg border border-[#30363d] bg-[#0d1117] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:bg-[#1d2229] hover:text-white"
                >
                  Reject
                </button>

                <button
                  onClick={handleApprove}
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  Approve & Continue →
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

              <span className="text-blue-400">
                ● Human Approval
              </span>

              <span className="text-gray-600">→</span>

              <span className="text-gray-500">
                ○ Rollback
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Approval;