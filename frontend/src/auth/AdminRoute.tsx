import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "./index";

interface AuthUser {
  role: number;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

const AdminRoute: React.FC = () => {
  const location = useLocation();
  const auth = isAuthenticated() as AuthResponse | false;

  if (auth && auth.user.role === 1) {
    return <Outlet />;
  }

  return (
    <Navigate
      to="/signin"
      replace
      state={{ from: location }}
    />
  );
};

export default AdminRoute;