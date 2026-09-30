import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AuditLog() {
  const navigate = useNavigate();

  const auditEvents = [
    {
      id: 1,
      action: "Incident Created",
      actor: "Incident Simulator",
      target: "INC-001",
      details: "High HTTP 500 Error Rate detected on Payment API.",
      time: "10:32 AM",
      type: "Incident",
    },
    {
      id: 2,
      action: "Investigation Started",
      actor: "AI Incident Agent",
      target: "INC-001",
      details: "Logs, metrics, and deployment data collected.",
      time: "10:35 AM",
      type: "Investigation",
    },
    {
      id: 3,
      action: "Root Cause Identified",
      actor: "AI Incident Agent",
      target: "INC-001",
      details: "Deployment v1.4.2 identified as the likely cause.",
      time: "10:39 AM",
      type: "Analysis",
    },
    {
      id: 4,
      action: "Remediation Proposed",
      actor: "AI Incident Agent",
      target: "INC-001",
      details: "Rollback deployment v1.4.2 recommended.",
      time: "10:41 AM",
      type: "Remediation",
    },
    {
      id: 5,
      action: "Rollback Approved",
      actor: "Authorized User",
      target: "INC-001",
      details: "Human approval received for the proposed rollback.",
      time: "10:43 AM",
      type: "Approval",
    },
    {
      id: 6,
      action: "Deployment Rolled Back",
      actor: "Remediation Engine",
      target: "v1.4.2 → v1.4.1",
      details: "Payment API restored to the previous stable deployment.",
      time: "10:45 AM",
      type: "Rollback",
    },
    {
      id: 7,
      action: "Verification Passed",
      actor: "Verification Engine",
      target: "INC-001",
      details: "Service health checks passed after rollback.",
      time: "10:48 AM",
      type: "Verification",
    },
    {
      id: 8,
      action: "Postmortem Generated",
      actor: "AI Incident Agent",
      target: "INC-001",
      details: "Incident response summary generated.",
      time: "10:50 AM",
      type: "Documentation",
    },
  ];

  const typeStyles = {
    Incident: "border-red-500/20 bg-red-500/10 text-red-400",
    Investigation: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    Analysis: "border-purple-500/20 bg-purple-500/10 text-purple-400",
    Remediation: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    Approval: "border-green-500/20 bg-green-500/10 text-green-400",
    Rollback: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    Verification: "border-green-500/20 bg-green-500/10 text-green-400",
    Documentation: "border-gray-500/20 bg-gray-500/10 text-gray-400",
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Audit Log
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Track actions and events performed during incident response.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Total Events
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                {auditEvents.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Current incident
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Automated Actions
              </p>

              <p className="mt-2 text-2xl font-semibold text-blue-400">
                7
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Agent and system events
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Human Actions
              </p>

              <p className="mt-2 text-2xl font-semibold text-green-400">
                1
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Approval events
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mb-5 flex flex-col gap-4 rounded-xl border border-[#252a31] bg-[#171b20] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Activity History
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Chronological record of incident-response activity.
              </p>
            </div>

            <button
              onClick={() => navigate("/incidents/INC-001")}
              className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-[#1d2229] hover:text-white"
            >
              View INC-001 →
            </button>
          </div>

          {/* Audit Events */}
          <div className="overflow-hidden rounded-xl border border-[#252a31] bg-[#171b20]">
            <div className="hidden border-b border-[#252a31] px-6 py-4 md:grid md:grid-cols-[1.4fr_1fr_1fr_1.8fr_100px] md:gap-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Action
              </p>

              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Actor
              </p>

              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Target
              </p>

              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Details
              </p>

              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Time
              </p>
            </div>

            <div className="divide-y divide-[#252a31]">
              {auditEvents.map((event) => (
                <div
                  key={event.id}
                  className="px-6 py-5 transition hover:bg-[#1b2026]"
                >
                  <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_1.8fr_100px] md:items-center md:gap-4">
                    {/* Action */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-medium text-white">
                          {event.action}
                        </p>

                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${
                            typeStyles[event.type]
                          }`}
                        >
                          {event.type}
                        </span>
                      </div>
                    </div>

                    {/* Actor */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-600 md:hidden">
                        Actor
                      </p>

                      <p className="mt-1 text-sm text-gray-300 md:mt-0">
                        {event.actor}
                      </p>
                    </div>

                    {/* Target */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-600 md:hidden">
                        Target
                      </p>

                      <p className="mt-1 font-mono text-sm text-gray-300 md:mt-0">
                        {event.target}
                      </p>
                    </div>

                    {/* Details */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-600 md:hidden">
                        Details
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-400 md:mt-0">
                        {event.details}
                      </p>
                    </div>

                    {/* Time */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-600 md:hidden">
                        Time
                      </p>

                      <p className="mt-1 text-sm text-gray-400 md:mt-0">
                        {event.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Principle */}
          <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
              Auditability
            </p>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Every important action is recorded
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-400">
              The audit trail records investigation activity, AI
              recommendations, human approval, remediation actions, rollback,
              verification, and postmortem generation. In the final system,
              these events can be persisted by the backend.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AuditLog;