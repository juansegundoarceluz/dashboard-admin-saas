import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute";

// ─── App ────────────────────────────────────────────────────────────────────
// Route table: mapeo declarativo URL -> componente. React Router se encarga
// del resto. Este componente NO tiene estado de UI; las rutas son la verdad.
// El switching anterior con useState (isLogin / isAuth) ya no existe.

export default function App() {
  return (
    <Routes>
      {/* Rutas publicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Default: cualquier URL desconocida manda al dashboard (que a su
          vez redirige a /login si no hay token). */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
