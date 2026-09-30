import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import IncidentDetails from "./pages/IncidentDetails";
import IncidentSimulator from "./pages/IncidentSimulator";
import Investigation from "./pages/Investigation";
import RootCause from "./pages/RootCause";
import Remediation from "./pages/Remediation";
import Approval from "./pages/Approval";
import Rollback from "./pages/Rollback";
import Verification from "./pages/Verification";
import Postmortem from "./pages/Postmortem";
import Deployments from "./pages/Deployments";
import AuditLog from "./pages/AuditLog";
import Settings from "./pages/Settings";
import TeamAccess from "./pages/TeamAccess";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;