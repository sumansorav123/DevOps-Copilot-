import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [backendStatus, setBackendStatus] = useState("checking");
    const [lastChecked, setLastChecked] = useState("");

    useEffect(() => {
        let active = true;
        api.health()
            .then(() => {
                if (!active) return;
                setBackendStatus("healthy");
                setLastChecked(new Date().toLocaleTimeString());
            })
            .catch(() => {
                if (active) setBackendStatus("unavailable");
            });
        return () => { active = false; };
    }, []);

    const navigation = [
        "Overview",
        "Incidents",
        "Incident Simulator",
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
                    const routes = {
                        Overview: "/",
                        Incidents: "/incidents",
                        "Incident Simulator": "/incident-simulator",
                        Investigation: "/investigation",
                        Deployments: "/deployments",
                        Postmortems: "/postmortem",
                        "Audit Log": "/audit-log",
                    };

                    const isActive = location.pathname === routes[item]
                        || (item === "Incidents" && location.pathname.startsWith("/incidents/"));

                    return (
                        <button
                            key={item}
                            onClick={() => navigate(routes[item])}
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
                    {systemNavigation.map((item) => {
                        const routes = {
                            Settings: "/settings",
                            "Team & Access": "/team-access",
                        };

                        return (
                            <button
                                key={item}
                                onClick={() => navigate(routes[item])}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-gray-400 transition hover:bg-[#151a1f] hover:text-white"
                            >
                                <span className="h-2 w-2 rounded-full border border-gray-500" />

                                {item}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto rounded-lg border border-green-900/40 bg-green-950/30 p-4">
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${backendStatus === "healthy" ? "bg-green-400" : backendStatus === "unavailable" ? "bg-red-400" : "bg-yellow-400"}`} />
                    <span className={`text-xs font-medium ${backendStatus === "healthy" ? "text-green-400" : backendStatus === "unavailable" ? "text-red-400" : "text-yellow-400"}`}>
                        {backendStatus === "healthy" ? "Backend operational" : backendStatus === "unavailable" ? "Backend unavailable" : "Checking backend"}
                    </span>
                </div>
                <p className="mt-2 text-[10px] text-gray-500">
                    {lastChecked ? `Last checked ${lastChecked}` : "Health check pending"}
                </p>
            </div>
        </aside>
    );
}

export default Sidebar;