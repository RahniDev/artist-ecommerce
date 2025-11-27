import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { useNavigate, NavLink } from 'react-router-dom'
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";
import React from 'react';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const activeStyle = { color: "#ff7315" };
    const defaultStyle = { color: "#3a3535" };

    const handleSignout = () => {
        signout(() => navigate("/"));
    };
    const auth = isAuthenticated();

    return (
        <div>
            <ul className="nav nav-items">
                <a className="navbar-brand" href="#">
                    <img src={logo} width="50px" height="50px" alt="Logo" />
                </a>

                <li className="nav-item">
                    <NavLink
                        to="/"
                        style={({ isActive }) => (isActive ? activeStyle : defaultStyle)}
                    >
                        Home
                    </NavLink>
                </li>

                {auth && auth.user.role === 0 && (
                    <li className="nav-item">
                        <NavLink
                            to="/user/dashboard"
                            style={({ isActive }) => (isActive ? activeStyle : defaultStyle)}
                        >
                            <Person2OutlinedIcon />
                        </NavLink>
                    </li>
                )}

                {auth && auth.user.role === 1 && (
                    <li className="nav-item">
                        <NavLink
                            to="/admin/dashboard"
                            style={({ isActive }) => (isActive ? activeStyle : defaultStyle)}
                        >
                            Dashboard
                        </NavLink>
                    </li>
                )}

                {!auth && (
                    <>
                        <li className="nav-item">
                            <NavLink
                                to="/signin"
                                style={({ isActive }) => (isActive ? activeStyle : defaultStyle)}
                            >
                                Signin
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/signup"
                                style={({ isActive }) => (isActive ? activeStyle : defaultStyle)}
                            >
                                Signup
                            </NavLink>
                        </li>
                    </>
                )}

                {auth && (
                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={{ cursor: "pointer", color: "#3a3535" }}
                            onClick={handleSignout}
                        >
                            Signout
                        </span>
                    </li>
                )}

                <li className="nav-item cart-icon">
                    <NavLink
                        to="/cart"
                        style={{ color: "#ff7315" }}
                    >
                        <ShoppingCartOutlinedIcon name="shopping cart" />{" "}
                        <sup>
                            <small className="cart-badge">{itemTotal()}</small>
                        </sup>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Navbar