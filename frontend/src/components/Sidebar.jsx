function Sidebar() {
  const navigation = [
    "Overview",
    "Incidents",
    "Investigation",
    "Deployments",
    "Postmortems",
    "Audit Log",
  ];

  const systemNavigation = [
    "Settings",
    "Team & Access",
  ];

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-[#1d2229] bg-[#070a0d] p-5">
      
      {/* Brand */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-green-400">
          OPS CONTROL
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          AI Incident Platform
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = item === "Overview";

          return (
            <button
              key={item}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                isActive
                  ? "bg-green-400 font-medium text-black"
                  : "text-gray-400 hover:bg-[#151a1f] hover:text-white"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full border ${
                  isActive
                    ? "border-black bg-black"
                    : "border-gray-500"
                }`}
              />

              {item}
            </button>
          );
        })}
      </nav>

      {/* System Section */}
      <div className="mt-8">
        <p className="mb-3 border-b border-[#20252b] pb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          System
        </p>

        <nav className="space-y-1">
          {systemNavigation.map((item) => (
            <button
              key={item}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-gray-400 transition hover:bg-[#151a1f] hover:text-white"
            >
              <span className="h-2 w-2 rounded-full border border-gray-500" />

              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* System Status */}
      <div className="mt-auto rounded-lg border border-green-900/40 bg-green-950/30 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400" />

          <span className="text-xs font-medium text-green-400">
            All systems operational
          </span>
        </div>

        <p className="mt-2 text-[10px] text-gray-500">
          Last checked 10:32:14
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;