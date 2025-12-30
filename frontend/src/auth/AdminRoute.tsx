import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth";

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();
  const auth = isAuthenticated();
  if (!auth || Number(auth.user.role) !== 1) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;