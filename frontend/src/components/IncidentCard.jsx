function IncidentCard({ incident, onClick }) {
  const severityStyles = {
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Low: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-[#252a31] bg-[#171b20] p-5 transition hover:border-gray-600 hover:bg-[#1b2026]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-gray-500">
            {incident.id}
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {incident.title}
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            {incident.service}
          </p>
        </div>

        <span
          className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
            severityStyles[incident.severity] ||
            severityStyles.Medium
          }`}
        >
          {incident.severity}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#252a31] pt-4">
        <span className="text-xs text-gray-500">
          Status:{" "}
          <span className="text-gray-300">
            {incident.status}
          </span>
        </span>

        <span className="text-xs text-gray-500">
          {incident.createdAt}
        </span>
      </div>
    </div>
  );
}

export default IncidentCard;