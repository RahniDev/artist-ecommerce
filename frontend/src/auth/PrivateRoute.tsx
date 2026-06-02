import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { PrivateRouteProps } from "../types";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return children;
};

export default PrivateRoute;