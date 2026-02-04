import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Button,
    Badge,
} from "@mui/material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { signout, isAuthenticated } from "../auth";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import logo from "../assets/react.svg";
import LangToggle from "./LangToggle";

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

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartCount = cartItems.reduce((total, item) => total + (item.count ?? 1), 0);

    const handleSignout = () => {
        signout(() => navigate("/"));
    };

    return (
        <AppBar position="static" elevation={1} sx={{ backgroundColor: "#fff" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box display="flex" alignItems="center">
                    <NavLink to="/">
                        <img src={logo} width="40" height="40" alt="Logo" />
                    </NavLink>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    {auth && auth.user.role === 0 && (
                        <IconButton component={NavLink} to="/user/dashboard" sx={linkStyle}>
                            <Person2OutlinedIcon />
                        </IconButton>
                    )}

                    <LangToggle />

                    {auth && auth.user.role === 1 && (
                        <Button component={NavLink} to="/admin/dashboard" sx={linkStyle}>
                            <Person2OutlinedIcon />
                        </Button>
                    )}

                    {!auth && (
                        <>
                            <Button component={NavLink} to="/signin" sx={linkStyle}>
                                Signin
                            </Button>
                        </>
                    )}

                    {auth && (
                        <Button onClick={handleSignout} sx={{ color: "#3a3535" }}>
                            Signout
                        </Button>
                    )}

                    <IconButton component={NavLink} to="/cart" sx={{ color: "#ff7315" }}>
                        <Badge badgeContent={cartCount} color="error">
                            <ShoppingCartOutlinedIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
