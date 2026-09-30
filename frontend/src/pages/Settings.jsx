import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Settings
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage incident-response agent preferences and system
              configuration.
            </p>
          </div>

          {/* General Settings */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                General
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Basic preferences for the incident response dashboard.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20]">
              <div className="flex flex-col gap-4 border-b border-[#252a31] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">
                    Incident Notifications
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Receive notifications when a new incident is detected.
                  </p>
                </div>

                <div className="h-6 w-11 rounded-full bg-white p-1">
                  <div className="h-4 w-4 translate-x-5 rounded-full bg-black" />
                </div>
              </div>

              <div className="flex flex-col gap-4 border-b border-[#252a31] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">
                    Approval Notifications
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Notify authorized users when remediation requires
                    approval.
                  </p>
                </div>

                <div className="h-6 w-11 rounded-full bg-white p-1">
                  <div className="h-4 w-4 translate-x-5 rounded-full bg-black" />
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">
                    Audit Logging
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Record important incident-response actions in the audit
                    log.
                  </p>
                </div>

                <div className="h-6 w-11 rounded-full bg-white p-1">
                  <div className="h-4 w-4 translate-x-5 rounded-full bg-black" />
                </div>
              </div>
            </div>
          </section>

          {/* Incident Configuration */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Incident Response
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Configure how the incident-response workflow behaves.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20]">
              <div className="border-b border-[#252a31] p-6">
                <label className="text-sm font-medium text-white">
                  Default Severity
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  Default severity assigned to simulated incidents.
                </p>

                <select
                  defaultValue="Medium"
                  className="mt-4 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-gray-500 sm:w-64"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div className="border-b border-[#252a31] p-6">
                <label className="text-sm font-medium text-white">
                  Human Approval
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  Require human approval before executing remediation actions.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
                  Enabled
                </div>
              </div>

              <div className="p-6">
                <label className="text-sm font-medium text-white">
                  Automatic Rollback
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  Automatic rollback remains disabled until explicitly
                  authorized.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-gray-500/20 bg-gray-500/10 px-3 py-1.5 text-xs font-medium text-gray-400">
                  Disabled
                </div>
              </div>
            </div>
          </section>

          {/* AI Agent Configuration */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                AI Agent
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Configure the behavior of the incident-response agent.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20]">
              <div className="border-b border-[#252a31] p-6">
                <label className="text-sm font-medium text-white">
                  Analysis Mode
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  Controls how the agent evaluates incident evidence.
                </p>

                <select
                  defaultValue="Evidence Based"
                  className="mt-4 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-gray-500 sm:w-64"
                >
                  <option>Evidence Based</option>
                  <option>Conservative</option>
                  <option>Detailed</option>
                </select>
              </div>

              <div className="p-6">
                <label className="text-sm font-medium text-white">
                  Evidence Sources
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  Sources available to the agent during investigation.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs text-green-400">
                    Application Logs
                  </span>

                  <span className="rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs text-green-400">
                    System Metrics
                  </span>

                  <span className="rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs text-green-400">
                    Deployments
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* System Status */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                System Status
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Current status of the prototype services.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Incident Agent
                </p>

                <p className="mt-2 text-sm font-medium text-green-400">
                  Operational
                </p>
              </div>

              <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Evidence Collection
                </p>

                <p className="mt-2 text-sm font-medium text-green-400">
                  Operational
                </p>
              </div>

              <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Remediation Engine
                </p>

                <p className="mt-2 text-sm font-medium text-green-400">
                  Operational
                </p>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section className="border-t border-[#252a31] pt-8">
            <div className="flex flex-col gap-4 rounded-xl border border-[#252a31] bg-[#171b20] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Team Access
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Manage users and permissions for incident-response actions.
                </p>
              </div>

              <button
                onClick={() => navigate("/team-access")}
                className="rounded-lg border border-[#30363d] bg-[#0d1117] px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#1d2229] hover:text-white"
              >
                Team & Access →
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Settings;