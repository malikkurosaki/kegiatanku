import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import clientRoutes from "@/clientRoutes";
import apiFetch from "@/lib/apiFetch";
import type { USER_ROLE } from "generated/prisma";

export default function RoleRoute({ role }: { role: USER_ROLE }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<USER_ROLE | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        // backend otomatis baca cookie JWT dari request
        const { data, status } = await apiFetch.api.user.find.get();
        setUserRole(data?.user?.role || null);
        setIsAuthenticated(status === 200);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkSession();
  }, []);

  if (isAuthenticated === null) return null; // or loading spinner
  if (!isAuthenticated) return <Navigate to={clientRoutes["/login"]} replace />;
  if (isAuthenticated && userRole !== role)
    return <Navigate to={clientRoutes["/profile"]} replace />;
  return <Outlet />;
}
