import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";

// ─── ProtectedRoute ─────────────────────────────────────────────────────────
// "Route guard": componente que decide si dejar pasar al usuario.
// Patrón clásico: si está autenticado, renderiza los children; si no,
// redirige a /login y se acuerda de a dónde quería ir, para volverlo
// después del login (mejor UX).

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // `replace` evita que el usuario pueda hacer "atrás" y volver a la
    // ruta protegida sin login. `state` guarda la ruta original para
    // redirigirlo de vuelta después del login.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
