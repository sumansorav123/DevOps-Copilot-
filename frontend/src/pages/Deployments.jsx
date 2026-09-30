import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Deployments() {
  const navigate = useNavigate();

  const deployments = [
    {
      version: "v1.4.2",
      service: "Payment API",
      commit: "a83f91c",
      status: "Rolled Back",
      deployedAt: "10:24 AM",
      duration: "4m 12s",
      incident: "INC-001",
      incidentStatus: "Correlated",
    },
    {
      version: "v1.4.1",
      service: "Payment API",
      commit: "7b21d4e",
      status: "Stable",
      deployedAt: "Yesterday, 4:18 PM",
      duration: "3m 48s",
      incident: "—",
      incidentStatus: "None",
    },
    {
      version: "v2.8.0",
      service: "Order Service",
      commit: "c91a72f",
      status: "Stable",
      deployedAt: "Yesterday, 2:42 PM",
      duration: "5m 03s",
      incident: "INC-002",
      incidentStatus: "Monitoring",
    },
    {
      version: "v3.2.4",
      service: "User Service",
      commit: "e42bc19",
      status: "Stable",
      deployedAt: "Yesterday, 11:30 AM",
      duration: "2m 56s",
      incident: "—",
      incidentStatus: "None",
    },
  ];

  const statusStyles = {
    Stable:
      "border-green-500/20 bg-green-500/10 text-green-400",
    "Rolled Back":
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    Failed:
      "border-red-500/20 bg-red-500/10 text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Deployments
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Monitor recent deployments and identify changes that may be
              related to incidents.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Recent Deployments
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                12
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Last 24 hours
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Stable
              </p>

              <p className="mt-2 text-2xl font-semibold text-green-400">
                10
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Currently healthy
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Incident Correlated
              </p>

              <p className="mt-2 text-2xl font-semibold text-yellow-400">
                2
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Require investigation
              </p>
            </div>
          </div>

          {/* Deployment List */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">
                Recent Deployments
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Deployment history across monitored services.
              </p>
            </div>

            <div className="space-y-4">
              {deployments.map((deployment) => (
                <div
                  key={`${deployment.service}-${deployment.version}`}
                  className="rounded-xl border border-[#252a31] bg-[#171b20] p-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Deployment Info */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          {deployment.version}
                        </h3>

                        <span
                          className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                            statusStyles[deployment.status] ||
                            statusStyles.Stable
                          }`}
                        >
                          {deployment.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-400">
                        {deployment.service}
                      </p>
                    </div>

                    {/* Commit */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Commit
                      </p>

                      <p className="mt-1 font-mono text-sm text-gray-200">
                        {deployment.commit}
                      </p>
                    </div>

                    {/* Deployment Time */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Deployed
                      </p>

                      <p className="mt-1 text-sm text-gray-300">
                        {deployment.deployedAt}
                      </p>
                    </div>

                    {/* Duration */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Duration
                      </p>

                      <p className="mt-1 text-sm text-gray-300">
                        {deployment.duration}
                      </p>
                    </div>
                  </div>

                  {/* Incident Correlation */}
                  <div className="mt-6 flex flex-col gap-4 border-t border-[#252a31] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Incident Correlation
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        {deployment.incident !== "—" ? (
                          <>
                            <button
                              onClick={() =>
                                navigate(
                                  `/incidents/${deployment.incident}`
                                )
                              }
                              className="font-mono text-sm text-blue-400 transition hover:text-blue-300"
                            >
                              {deployment.incident}
                            </button>

                            <span className="rounded-md border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400">
                              {deployment.incidentStatus}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No related incident
                          </span>
                        )}
                      </div>
                    </div>

                    {deployment.incident !== "—" && (
                      <button
                        onClick={() =>
                          navigate(
                            `/incidents/${deployment.incident}`
                          )
                        }
                        className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-[#1d2229] hover:text-white"
                      >
                        View Incident →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Deployment Analysis */}
          <section className="mt-10 border-t border-[#252a31] pt-8">
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-yellow-500">
                Deployment Analysis
              </p>

              <h2 className="mt-2 text-lg font-semibold text-white">
                Recent deployment correlation detected
              </h2>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-400">
                Deployment v1.4.2 of the Payment API occurred shortly before
                INC-001. The deployment was subsequently rolled back during
                incident remediation.
              </p>

              <button
                onClick={() => navigate("/incidents/INC-001")}
                className="mt-5 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                View INC-001 →
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Deployments;