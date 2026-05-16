import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageSkeleton from "../ui/PageSkeleton";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
