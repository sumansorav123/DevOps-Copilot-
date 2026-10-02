import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Incidents = lazy(() => import("./pages/Incidents"));
const IncidentDetails = lazy(() => import("./pages/IncidentDetails"));
const IncidentSimulator = lazy(() => import("./pages/IncidentSimulator"));
const Investigation = lazy(() => import("./pages/Investigation"));
const RootCause = lazy(() => import("./pages/RootCause"));
const Remediation = lazy(() => import("./pages/Remediation"));
const Approval = lazy(() => import("./pages/Approval"));
const Rollback = lazy(() => import("./pages/Rollback"));
const Verification = lazy(() => import("./pages/Verification"));
const Postmortem = lazy(() => import("./pages/Postmortem"));
const Deployments = lazy(() => import("./pages/Deployments"));
const AuditLog = lazy(() => import("./pages/AuditLog"));
const Settings = lazy(() => import("./pages/Settings"));
const TeamAccess = lazy(() => import("./pages/TeamAccess"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<main className="min-h-screen bg-[#0d1117] p-8 text-gray-400">Loading page...</main>}>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Incident Simulator */}
          <Route
            path="/incident-simulator"
            element={<IncidentSimulator />}
          />

          {/* Incident Flow */}
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/incidents/:id" element={<IncidentDetails />} />

          {/* Investigation */}
          <Route path="/investigation" element={<Investigation />} />

          {/* Root Cause Analysis */}
          <Route path="/root-cause" element={<RootCause />} />

          {/* Remediation */}
          <Route path="/remediation" element={<Remediation />} />

          {/* Human Approval */}
          <Route path="/approval" element={<Approval />} />

          {/* Rollback */}
          <Route path="/rollback" element={<Rollback />} />

          {/* Verification */}
          <Route path="/verification" element={<Verification />} />

          {/* Postmortem */}
          <Route path="/postmortem" element={<Postmortem />} />

          {/* Deployments */}
          <Route path="/deployments" element={<Deployments />} />

          {/* Audit Log */}
          <Route path="/audit-log" element={<AuditLog />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

          {/* Team & Access */}
          <Route path="/team-access" element={<TeamAccess />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;