
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import IncidentCard from "../components/IncidentCard";
import api from "../services/api";
import { goToWorkflow } from "../utils/incidentWorkflow";

function Incidents() {
    const navigate = useNavigate();

    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadIncidents = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await api.incidents();

                // Backend should return an array of incidents.
                // Keep this defensive in case the response is wrapped.
                const incidentList = Array.isArray(data)
                    ? data
                    : data.incidents || data.data || [];

                setIncidents(incidentList);
            } catch (err) {
                console.error("Failed to load incidents:", err);

                setError(
                    err.message || "Failed to load incidents from the backend."
                );
            } finally {
                setLoading(false);
            }
        };

        loadIncidents();
    }, []);

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            <div className="flex min-h-screen">
                <Sidebar />

                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Incidents
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Monitor and manage active incidents.
                        </p>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="rounded-xl border border-gray-800 bg-[#11161d] p-6 text-gray-400">
                            Loading incidents...
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6">
                            <p className="font-medium text-red-400">
                                Failed to load incidents
                            </p>

                            <p className="mt-2 text-sm text-gray-400">
                                {error}
                            </p>

                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && !error && incidents.length === 0 && (
                        <div className="rounded-xl border border-gray-800 bg-[#11161d] p-8 text-center">
                            <p className="text-gray-300">
                                No incidents found.
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Create or simulate an incident to begin an investigation.
                            </p>
                        </div>
                    )}

                    {/* Incidents */}
                    {!loading && !error && incidents.length > 0 && (
                        <div className="space-y-4">
                            {incidents.map((incident) => {
                                const incidentId =
                                    incident.id || incident.incident_id;

                                return (
                                    <IncidentCard
                                        key={incidentId}
                                        incident={incident}
                                        onClick={() =>
                                            goToWorkflow(
                                                navigate,
                                                `/incidents/${incidentId}`,
                                                incidentId,
                                            )
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Incidents;

