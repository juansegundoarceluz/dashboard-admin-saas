import type { NavItem, StaffMember, QuickAction } from "../types";

// ─── Mock data ──────────────────────────────────────────────────────────────
// Mientras el backend no expone Equipo/Acciones rápidas, los datos viven acá.
// Cuando agreguemos endpoints reales, reemplazamos los imports por fetchs.
// Mantener los mocks separados de los componentes hace fácil ese reemplazo.

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "projects",  label: "Proyectos", icon: "◷" },
  { id: "tasks",     label: "Tareas",    icon: "◉" },
  { id: "team",      label: "Equipo",    icon: "◈" },
  { id: "reports",   label: "Reportes",  icon: "◎" },
  { id: "settings",  label: "Ajustes",   icon: "◌" },
];

export const mockStaff: StaffMember[] = [
  { id: "1", name: "Ana Rodríguez",   role: "Project Lead",    appointments: 12, avatar: "AR" },
  { id: "2", name: "Bruno Martínez",  role: "Backend Dev",     appointments: 8,  avatar: "BM" },
  { id: "3", name: "Carla Fernández", role: "Frontend Dev",    appointments: 15, avatar: "CF" },
];

export const quickActions: QuickAction[] = [
  { label: "Nuevo proyecto", color: "#6366F1" },
  { label: "Agregar tarea",  color: "#22c55e" },
  { label: "Ver reportes",   color: "#8B5CF6" },
];
