import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function TeamAccess() {
  const navigate = useNavigate();

  const members = [
    {
      name: "Alex Morgan",
      email: "alex@opscontrol.dev",
      role: "Administrator",
      access: "Full Access",
      status: "Active",
    },
    {
      name: "Jordan Lee",
      email: "jordan@opscontrol.dev",
      role: "Incident Responder",
      access: "Incident Operations",
      status: "Active",
    },
    {
      name: "Taylor Smith",
      email: "taylor@opscontrol.dev",
      role: "Viewer",
      access: "Read Only",
      status: "Active",
    },
  ];

  const roleStyles = {
    Administrator:
      "border-purple-500/20 bg-purple-500/10 text-purple-400",
    "Incident Responder":
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
    Viewer:
      "border-gray-500/20 bg-gray-500/10 text-gray-400",
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/settings")}
              className="mb-5 text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to Settings
            </button>

            <h1 className="text-3xl font-bold tracking-tight">
              Team & Access
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage team members and their permissions for incident-response
              operations.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Team Members
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                {members.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Configured users
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Active Members
              </p>

              <p className="mt-2 text-2xl font-semibold text-green-400">
                {members.filter((member) => member.status === "Active").length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Currently active
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Administrators
              </p>

              <p className="mt-2 text-2xl font-semibold text-purple-400">
                {
                  members.filter(
                    (member) => member.role === "Administrator"
                  ).length
                }
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Full system access
              </p>
            </div>
          </div>

          {/* Access Notice */}
          <div className="mb-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400">
                i
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Human approval permissions
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Users with incident-response permissions can review and
                  approve remediation actions before they are executed.
                </p>
              </div>
            </div>
          </div>

          {/* Members */}
          <section className="mb-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Team Members
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Current users and their access levels.
                </p>
              </div>

              <button
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                + Add Member
              </button>
            </div>

            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.email}
                  className="rounded-xl border border-[#252a31] bg-[#171b20] p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* User */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#30363d] bg-[#0d1117] text-sm font-semibold text-gray-300">
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {member.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Role
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-md border px-2.5 py-1 text-xs font-medium ${
                          roleStyles[member.role]
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>

                    {/* Access */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Access
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        {member.access}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Status
                      </p>

                      <p className="mt-2 flex items-center gap-2 text-sm text-green-400">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        {member.status}
                      </p>
                    </div>

                    {/* Action */}
                    <button
                      className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-gray-300 transition hover:bg-[#1d2229] hover:text-white"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Permission Levels */}
          <section className="mb-8">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">
                Permission Levels
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Available access levels in the incident-response platform.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-purple-500/20 bg-[#171b20] p-5">
                <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-400">
                  Administrator
                </span>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                  Full access to incidents, remediation, approvals, system
                  configuration, and team management.
                </p>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-[#171b20] p-5">
                <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                  Incident Responder
                </span>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                  Can investigate incidents, review recommendations, and
                  participate in remediation approval.
                </p>
              </div>

              <div className="rounded-xl border border-gray-500/20 bg-[#171b20] p-5">
                <span className="rounded-md border border-gray-500/20 bg-gray-500/10 px-2.5 py-1 text-xs font-medium text-gray-400">
                  Viewer
                </span>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                  Read-only access to incidents, deployments, audit events,
                  and postmortems.
                </p>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="border-t border-[#252a31] pt-8">
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <h2 className="text-lg font-semibold text-white">
                Access Control
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
                In the final system, access permissions will be managed by the
                backend and enforced for sensitive incident-response actions.
                The current page uses simulated team data for the prototype.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default TeamAccess;