import React, { useEffect, useState } from "react";
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
import type { Category } from "../types";
import { getCategories } from "./apiCore";

const linkStyle = {
  textDecoration: "none",
  color: "#3a3535",
  "&.active": { color: "#7a7a7a" },
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; categoryId: string } | null>(null);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + (item.count ?? 1), 0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDropdownClose = () => setAnchorEl(null);

  const handleSignout = () => {
    dispatch(clearAuth());
    navigate("/");
    handleDropdownClose();
  };
  const loadCategories = async () => {
    const res = await getCategories();
    if (res.error) {
      console.error(res.error);
    } else {
      setCategories(res.data ?? []);
    }
  };
  useEffect(() => { loadCategories(); }, []);

  const topLevel = categories.filter(c => !c.parent);
  const getSubcategories = (parentId: string) =>
    categories.filter(c =>
      c.parent && (typeof c.parent === "object" ? c.parent._id === parentId : c.parent === parentId)
    );

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
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 2 }}>
          <NavLink to="/about">About</NavLink>

          {topLevel.map(c => {
            const subs = getSubcategories(c._id);
            return (
              <Box key={c._id}>


                <NavLink
                  to={`/category/${c._id}`}
                  style={linkStyle}
                  onMouseEnter={(e) => subs.length > 0 && setMenuAnchor({ el: e.currentTarget, categoryId: c._id })}
                >
                  {c.name}
                </NavLink>

                {subs.length > 0 && (
                  <Menu
                    anchorEl={menuAnchor?.categoryId === c._id ? menuAnchor.el : null}
                    open={menuAnchor?.categoryId === c._id}
                    onClose={() => setMenuAnchor(null)}
                    disableAutoFocus
                    slotProps={{
                      list: { onMouseLeave: () => setMenuAnchor(null) }
                    }}
                  >
                    {subs.map(sub => (
                      <MenuItem
                        key={sub._id}
                        onClick={() => {
                          navigate(`/category/${sub._id}`);
                          setMenuAnchor(null);
                        }}
                      >
                        {sub.name}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </Box>
            );
          })}
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

              <IconButton onClick={handleDropdownOpen} sx={{ color: "#3a3535" }}>
                <Person2OutlinedIcon fontSize="medium" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleDropdownClose}>
                {user?.role === 0 && (
                  <MenuItem
                    onClick={() => {
                      navigate("/user/dashboard");
                      handleDropdownClose();
                    }}
                  >
                    Dashboard
                  </MenuItem>
                )}
                {user?.role === 1 && (
                  <MenuItem
                    onClick={() => {
                      navigate("/admin/dashboard");
                      handleDropdownClose();
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