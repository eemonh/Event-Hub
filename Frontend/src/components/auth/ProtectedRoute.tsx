import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageSkeleton from "../ui/PageSkeleton";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectTo = "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
