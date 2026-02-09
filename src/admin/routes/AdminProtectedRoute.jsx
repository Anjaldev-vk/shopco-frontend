import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectCurrentUser, selectIsAuthenticated, selectIsAdmin, selectAuthLoading } from "../../features/auth/selectors";
import { Loader2 } from "lucide-react";

const AdminProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);

  if (loading) {
     return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
           <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        </div>
     );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin || user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
