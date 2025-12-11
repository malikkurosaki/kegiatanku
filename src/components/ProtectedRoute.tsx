import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import clientRoutes from "@/clientRoutes";
import apiFetch from "@/lib/apiFetch";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        // backend otomatis baca cookie JWT dari request
        const res = await apiFetch.api.user.find.get();
        setIsAuthenticated(res.status === 200);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkSession();
  }, []);

  if (isAuthenticated === null) return null; // or loading spinner
  if (!isAuthenticated) return <Navigate to={clientRoutes["/login"]} replace />;
  return <Outlet />;
}
