import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Button,
    Badge
} from "@mui/material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";
import logo from "../assets/react.svg";

const linkStyle = {
    textDecoration: "none",
    color: "#3a3535",
    "&.active": {
        color: "#ff7315",
    },
};

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const auth = isAuthenticated();

    const handleSignout = () => {
        signout(() => navigate("/"));
    };

    return (
        <AppBar position="static" elevation={1} sx={{ backgroundColor: "#fff" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Logo */}
                <Box display="flex" alignItems="center">
                    <NavLink to="/">
                        <img src={logo} width="40" height="40" alt="Logo" />
                    </NavLink>
                </Box>

                {/* Navigation Links */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Button
                        component={NavLink}
                        to="/"
                        sx={linkStyle}
                    >
                        Home
                    </Button>

                    {auth && auth.user.role === 0 && (
                        <IconButton
                            component={NavLink}
                            to="/user/dashboard"
                            sx={linkStyle}
                        >
                            <Person2OutlinedIcon />
                        </IconButton>
                    )}

                    {auth && auth.user.role === 1 && (
                        <Button
                            component={NavLink}
                            to="/admin/dashboard"
                            sx={linkStyle}
                        >
                            Dashboard
                        </Button>
                    )}

                    {!auth && (
                        <>
                            <Button
                                component={NavLink}
                                to="/signin"
                                sx={linkStyle}
                            >
                                Signin
                            </Button>
                            <Button
                                component={NavLink}
                                to="/signup"
                                sx={linkStyle}
                            >
                                Signup
                            </Button>
                        </>
                    )}

                    {auth && (
                        <Button
                            onClick={handleSignout}
                            sx={{ color: "#3a3535" }}
                        >
                            Signout
                        </Button>
                    )}

                    {/* Cart */}
                    <IconButton
                        component={NavLink}
                        to="/cart"
                        sx={{ color: "#ff7315" }}
                    >
                        <Badge badgeContent={itemTotal()} color="error">
                            <ShoppingCartOutlinedIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;