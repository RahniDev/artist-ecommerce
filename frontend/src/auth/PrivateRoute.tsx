import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth";
import type { PrivateRouteProps } from "../types";

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const auth = isAuthenticated();

  if (!auth) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
