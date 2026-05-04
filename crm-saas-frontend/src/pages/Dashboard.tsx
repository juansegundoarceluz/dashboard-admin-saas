import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navItems, mockStaff, quickActions } from "../data/mockData";
import { useAuth } from "../auth/useAuth";
import { useProjects } from "../hooks/useProjects";

import Sidebar from "../components/dashboard/Sidebar";
import TopBar from "../components/dashboard/TopBar";
import MetricCard from "../components/dashboard/MetricCard";
import ProjectsTable from "../components/dashboard/ProjectsTable";
import TeamPanel from "../components/dashboard/TeamPanel";
import QuickActions from "../components/dashboard/QuickActions";

// ─── Dashboard ──────────────────────────────────────────────────────────────
// Composition root. Toda la logica de fetching ahora vive en useProjects.
// Este componente solo orquesta UI.

export default function Dashboard() {
    const [activeNav, setActiveNav] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // ─── Server state via TanStack Query ─────────────────────────────────────
    // Una sola linea reemplaza: useState(projects), useState(loading),
    // useState(error), useEffect, AbortController y todo el manejo manual.
    const { data: projects = [], isLoading, error } = useProjects();

    // ─── Auth ────────────────────────────────────────────────────────────────
    const { logout } = useAuth();
    const navigate = useNavigate();

    const companyName = localStorage.getItem("companyName") || "Mi Empresa";

    // ─── Metricas derivadas ──────────────────────────────────────────────────
    const totalProjects = projects.length;
    const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
    const completedTasks = projects.reduce(
        (sum, p) => sum + p.tasks.filter((t) => t.completed).length,
        0,
    );

    // ─── Handlers ────────────────────────────────────────────────────────────
    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const handleQuickAction = (label: string) => {
        console.log("Quick action:", label);
    };

    return (
        <div className="flex min-h-screen bg-app text-text">
            <Sidebar
                items={navItems}
                activeId={activeNav}
                open={sidebarOpen}
                companyName={companyName}
                onSelect={setActiveNav}
                onToggle={() => setSidebarOpen((prev) => !prev)}
            />

            <main className="flex flex-col flex-1 overflow-auto">
                <TopBar title="Dashboard" onLogout={handleLogout} />

                <div className="flex-1 p-8">
                    <div className="flex flex-wrap gap-4 mb-8">
                        <MetricCard label="Proyectos activos" value={String(totalProjects)} sub="Total de proyectos" accent="#6366F1" />
                        <MetricCard label="Tareas totales" value={String(totalTasks)} sub={`${completedTasks} completadas`} accent="#22c55e" />
                        <MetricCard label="Clientes activos" value="48" sub="+3 esta semana" accent="#eab308" />
                        <MetricCard label="Satisfaccion" value="4.9" sub="Basado en 32 resenas" accent="#8B5CF6" />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                        <ProjectsTable
                            projects={projects}
                            loading={isLoading}
                            error={error ? "No se pudieron cargar los proyectos" : null}
                        />
                        <div className="flex flex-col gap-4">
                            <TeamPanel members={mockStaff} />
                            <QuickActions actions={quickActions} onAction={handleQuickAction} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
