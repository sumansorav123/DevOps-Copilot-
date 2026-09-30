import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIncident } from "../api/incidents";

function IncidentSimulator() {
    const navigate = useNavigate();

    const [incidentType, setIncidentType] = useState("HTTP 500 Error Spike");
    const [service, setService] = useState("Payment API");
    const [severity, setSeverity] = useState("Critical");
    const [createdIncident, setCreatedIncident] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const incidentTypes = [
        "HTTP 500 Error Spike",
        "Memory Usage Spike",
    ];

    const services = [
        "Payment API",
        "User Service",
        "Order Service",
        "Authentication Service",
    ];

    const severities = [
        "Critical",
        "High",
        "Medium",
    ];

    const handleGenerateIncident = async () => {
        try {
            setLoading(true);
            setError("");

            const incident = await createIncident({
                scenario: incidentType,
                service,
            });

            setCreatedIncident(incident);
        } catch (error) {
            console.error("Failed to create incident:", error);
            setError(error.message || "Failed to create incident.");
        } finally {
            setLoading(false);
        }
    };
    const handleInvestigate = () => {
        if (!createdIncident) return;

        navigate(`/incidents/${createdIncident.id}`, {
            state: {
                incident: createdIncident,
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#070a0d] p-8 text-white">

            {/* Header */}
            <div className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-green-400">
                    Incident Operations
                </p>

                <h1 className="text-3xl font-semibold">
                    Incident Simulator
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                    Create a controlled software incident to demonstrate the
                    AI-powered incident response workflow.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Configuration */}
                <div className="lg:col-span-2 rounded-xl border border-[#1d2229] bg-[#0b0f13] p-6">

                    <div className="mb-6">
                        <h2 className="text-lg font-medium">
                            Create Simulated Incident
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Select the conditions for the controlled failure.
                        </p>
                    </div>

                    <div className="space-y-6">

                        {/* Incident Type */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                Incident Type
                            </label>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {incidentTypes.map((type) => {
                                    const selected = incidentType === type;

                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setIncidentType(type)}
                                            className={`rounded-lg border p-4 text-left transition ${selected
                                                ? "border-green-400 bg-green-400/10"
                                                : "border-[#252b32] bg-[#0e1318] hover:border-gray-500"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`h-3 w-3 rounded-full border ${selected
                                                        ? "border-green-400 bg-green-400"
                                                        : "border-gray-600"
                                                        }`}
                                                />

                                                <span
                                                    className={`text-sm ${selected
                                                        ? "text-green-400"
                                                        : "text-gray-300"
                                                        }`}
                                                >
                                                    {type}
                                                </span>
                                            </div>

                                            <p className="mt-2 pl-6 text-xs text-gray-600">
                                                {type === "HTTP 500 Error Spike"
                                                    ? "Simulate a sudden increase in application errors."
                                                    : "Simulate abnormal memory consumption."}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Service */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                Affected Service
                            </label>

                            <select
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                className="w-full rounded-lg border border-[#252b32] bg-[#0e1318] px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-green-400"
                            >
                                {services.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Severity */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                                Severity
                            </label>

                            <div className="flex flex-wrap gap-3">
                                {severities.map((level) => {
                                    const selected = severity === level;

                                    return (
                                        <button
                                            key={level}
                                            onClick={() => setSeverity(level)}
                                            className={`rounded-lg border px-5 py-2.5 text-sm transition ${selected
                                                ? "border-green-400 bg-green-400/10 text-green-400"
                                                : "border-[#252b32] text-gray-500 hover:border-gray-500 hover:text-gray-300"
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Generate */}
                        <div className="border-t border-[#1d2229] pt-6">
                            <button
                                onClick={handleGenerateIncident}
                                disabled={loading}
                                className="rounded-lg bg-green-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Creating Incident..." : "Generate Incident"}
                            </button>

                            {error && (
                                <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/20 p-3 text-xs text-red-400">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview / Result */}
                <div className="rounded-xl border border-[#1d2229] bg-[#0b0f13] p-6">

                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
                            Incident Preview
                        </p>

                        <h2 className="mt-2 text-lg font-medium">
                            {createdIncident
                                ? "Incident Created"
                                : "Ready to Simulate"}
                        </h2>
                    </div>

                    {!createdIncident ? (
                        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-[#252b32] px-6 text-center">
                            <div>
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#303740] text-gray-500">
                                    !
                                </div>

                                <p className="text-sm text-gray-400">
                                    No incident generated yet.
                                </p>

                                <p className="mt-2 text-xs text-gray-600">
                                    Configure the incident and select
                                    Generate Incident.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">

                            {/* Status */}
                            <div className="rounded-lg border border-green-900/40 bg-green-950/20 p-4">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-400" />

                                    <span className="text-xs font-medium text-green-400">
                                        Incident Active
                                    </span>
                                </div>
                            </div>

                            {/* Incident ID */}
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                                    Incident ID
                                </p>

                                <p className="mt-1 font-mono text-sm text-white">
                                    {createdIncident.id}
                                </p>
                            </div>

                            {/* Type */}
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                                    Incident Type
                                </p>

                                <p className="mt-1 text-sm text-gray-300">
                                    {createdIncident.type}
                                </p>
                            </div>

                            {/* Service */}
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                                    Affected Service
                                </p>

                                <p className="mt-1 text-sm text-gray-300">
                                    {createdIncident.service}
                                </p>
                            </div>

                            {/* Severity */}
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                                    Severity
                                </p>

                                <p className="mt-1 text-sm text-red-400">
                                    {createdIncident.severity}
                                </p>
                            </div>

                            {/* Time */}
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                                    Created
                                </p>

                                <p className="mt-1 font-mono text-xs text-gray-400">
                                    {createdIncident.createdAt}
                                </p>
                            </div>

                            {/* Investigate */}
                            <button
                                onClick={handleInvestigate}
                                className="w-full rounded-lg border border-green-400 bg-green-400/10 px-4 py-3 text-sm font-medium text-green-400 transition hover:bg-green-400 hover:text-black"
                            >
                                Investigate Incident →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default IncidentSimulator;