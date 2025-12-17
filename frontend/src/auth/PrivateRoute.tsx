import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "./index";

interface AuthUser {
  role: number;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export default function PrivateRoute() {
  const location = useLocation();
  const auth = isAuthenticated() as AuthResponse | false;

  if (auth) {
    // User is authenticated, allow route
    return <Outlet />;
  }

  // Not authenticated, redirect to signin
  return <Navigate to="/signin" replace state={{ from: location }} />;
}