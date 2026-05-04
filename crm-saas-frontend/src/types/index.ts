// ─── Domain types ───────────────────────────────────────────────────────────
// Estos tipos modelan los datos que vienen del backend (Prisma -> API).
// Mantenerlos en un módulo separado es "single source of truth": cualquier
// archivo que los necesita los importa de acá.

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;       // ISO string que devuelve Prisma vía JSON
  projectId: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  userId: string;
  tasks: Task[];
};

// ─── UI types ───────────────────────────────────────────────────────────────
// Estos no vienen del backend; son shape internos para componentes.

export type NavItem = {
  id: string;
  label: string;
  icon: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  appointments: number;
  avatar: string;
};

export type QuickAction = {
  label: string;
  /** color en formato hex; lo usamos como tinte del botón */
  color: string;
};
