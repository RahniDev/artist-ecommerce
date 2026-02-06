import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { clearAuth } from "../redux/slices/authSlice";
import logo from "../assets/react.svg";
import LangToggle from "./LangToggle";

const linkStyle = {
  textDecoration: "none",
  color: "#3a3535",
  "&.active": { color: "#ff7315" },
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + (item.count ?? 1), 0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleSignout = () => {
    dispatch(clearAuth());
    navigate("/");
    handleMenuClose();
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
          {isAuthenticated && (
            <>
              <Button
                onClick={handleMenuOpen}
                sx={{ textTransform: "none", color: "#3a3535" }}
                startIcon={<Person2OutlinedIcon />}
              >
                {user?.name}
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                {user?.role === 0 && (
                  <MenuItem onClick={() => { navigate("/user/dashboard"); handleMenuClose(); }}>
                    Dashboard
                  </MenuItem>
                )}
                {user?.role === 1 && (
                  <MenuItem onClick={() => { navigate("/admin/dashboard"); handleMenuClose(); }}>
                    Admin
                  </MenuItem>
                )}
                <MenuItem onClick={handleSignout}>Sign Out</MenuItem>
              </Menu>
            </>
          )}

          {!isAuthenticated && (
            <Button component={NavLink} to="/signin" sx={linkStyle}>
              <Person2OutlinedIcon />
            </Button>
          )}

          <LangToggle />

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