import Sidebar from "../components/Sidebar";

function Dashboard() {
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
                Use this screen to continue the incident-response workflow.
              </p>
            </div>

            <div className="rounded-xl border border-[#252a31] bg-[#171b20] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Next Step
              </p>

              <h2 className="mt-5 text-xl font-semibold">
                Select a navigation item
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Choose an area from the sidebar to investigate and respond
                to incidents.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;