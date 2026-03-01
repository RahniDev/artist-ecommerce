import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { clearAuth } from "../redux/slices/authSlice";
import LangToggle from "./LangToggle";
import Search from "./Search";

const linkStyle = {
  textDecoration: "none",
  color: "#3a3535",
  "&.active": { color: "#7a7a7a" },
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
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>

        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 120 }}>
          <NavLink to="/" id="logo">
            SK
          </NavLink>
        </Box>

        {/* CENTER (Search) */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: { xs: "100%", sm: "60%", md: "40%" } }}>
            <Search />
          </Box>
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            minWidth: 120,
            justifyContent: "flex-end",
          }}
        >
          <LangToggle />

          {isAuthenticated ? (
            <>
              <IconButton component={NavLink} to="/signin" sx={{ color: "#3a3535" }}>
                <Person2OutlinedIcon fontSize="medium" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                {user?.role === 0 && (
                  <MenuItem
                    onClick={() => {
                      navigate("/user/dashboard");
                      handleMenuClose();
                    }}
                  >
                    Dashboard
                  </MenuItem>
                )}
                {user?.role === 1 && (
                  <MenuItem
                    onClick={() => {
                      navigate("/admin/dashboard");
                      handleMenuClose();
                    }}
                  >
                    Admin
                  </MenuItem>
                )}
                <MenuItem onClick={handleSignout}>Sign Out</MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton component={NavLink} to="/signin" sx={{ color: linkStyle }}>
              <Person2OutlinedIcon fontSize="medium" />
            </IconButton>
          )}

          <IconButton component={NavLink} to="/cart" sx={{ color: linkStyle }}>
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