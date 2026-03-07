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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { clearAuth } from "../redux/slices/authSlice";
import LangToggle from "./LangToggle";
import type { Category } from "../types";
import { getCategories } from "./apiCore";

const linkStyle = {
  color: "#3a3535",
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + (item.count ?? 1), 0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleDropdownClose = () => setAnchorEl(null);
  const handleSignout = () => {
    dispatch(clearAuth());
    navigate("/");
    handleDropdownClose();
  };

  const loadCategories = async () => {
    const res = await getCategories();
    if (res.error) console.error(res.error);
    else setCategories(res.data ?? []);
  };

  useEffect(() => { loadCategories(); }, []);

  const topLevel = categories.filter(c => !c.parent);
  const getSubcategories = (parentId: string) =>
    categories.filter(c =>
      c.parent && (typeof c.parent === "object" ? c.parent._id === parentId : c.parent === parentId)
    );

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{ sx: { width: 280 } }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { navigate("/about"); setDrawerOpen(false); }}
          >
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>

        {topLevel.map(c => {
          const subs = getSubcategories(c._id);
          const isExpanded = expandedCategory === c._id;

          return (
            <React.Fragment key={c._id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (subs.length > 0) {
                      setExpandedCategory(isExpanded ? null : c._id);
                    } else {
                      navigate(`/category/${c._id}`);
                      setDrawerOpen(false);
                    }
                  }}
                >
                  <ListItemText primary={c.name} />
                  {subs.length > 0 && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>

              {subs.length > 0 && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  {/* Tapping the category name navigates to it */}
                  <ListItem disablePadding>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={() => { navigate(`/category/${c._id}`); setDrawerOpen(false); }}
                    >
                      <ListItemText
                        primary={`All ${c.name}`}
                        primaryTypographyProps={{ sx: { fontStyle: "italic", color: "#777" } }}
                      />
                    </ListItemButton>
                  </ListItem>
                  {subs.map(sub => (
                    <ListItem key={sub._id} disablePadding>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() => { navigate(`/category/${sub._id}`); setDrawerOpen(false); }}
                      >
                        <ListItemText primary={sub.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Drawer>
  );

  const DesktopLinks = () => (
    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 3, fontWeight: 500 }}>
      <NavLink to="/about" style={linkStyle}>About</NavLink>

      {topLevel.map(c => {
        const subs = getSubcategories(c._id);
        const isHovering = hoveredCategory === c._id;

        return (
          <Box
            key={c._id}
            sx={{ position: "relative" }}
            onMouseEnter={() => subs.length > 0 && setHoveredCategory(c._id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <NavLink to={`/category/${c._id}`} style={linkStyle}>
              {c.name}
            </NavLink>

            {subs.length > 0 && isHovering && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "white",
                  color: "black",
                  boxShadow: 3,
                  borderRadius: 1,
                  minWidth: 200,
                  zIndex: 1300,
                }}
                onMouseEnter={() => setHoveredCategory(c._id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {subs.map(sub => (
                  <Box
                    key={sub._id}
                    sx={{ padding: "8px 16px", cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                    onClick={() => { navigate(`/category/${sub._id}`); setHoveredCategory(null); }}
                  >
                    {sub.name}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );

  return (
    <AppBar position="static" elevation={1} sx={{ backgroundColor: "#fff" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>

        {/* LEFT — hamburger on mobile, logo always */}
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 120, gap: 1 }}>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "#3a3535" }}>
              <MenuIcon />
            </IconButton>
          )}
          <NavLink to="/" id="logo" style={linkStyle}>SK</NavLink>
        </Box>

        {/* CENTER — desktop only */}
        {!isMobile && <DesktopLinks />}

        {/* spacer on mobile to push right icons to edge */}
        {isMobile && <Box sx={{ flexGrow: 1 }} />}

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 120, justifyContent: "flex-end" }}>
          <LangToggle />
          {isAuthenticated ? (
            <>
              <IconButton onClick={handleDropdownOpen} sx={{ color: "#3a3535" }}>
                <Person2OutlinedIcon fontSize="medium" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleDropdownClose}>
                {user?.role === 0 && (
                  <MenuItem onClick={() => { navigate("/user/dashboard"); handleDropdownClose(); }}>
                    Dashboard
                  </MenuItem>
                )}
                {user?.role === 1 && (
                  <MenuItem onClick={() => { navigate("/admin/dashboard"); handleDropdownClose(); }}>
                    Admin
                  </MenuItem>
                )}
                <MenuItem onClick={handleSignout}>Sign Out</MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton component={NavLink} to="/signin" sx={{ color: "#3a3535" }}>
              <Person2OutlinedIcon fontSize="medium" />
            </IconButton>
          )}

          <IconButton component={NavLink} to="/cart" sx={{ color: "#3a3535" }}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>

      <MobileDrawer />
    </AppBar>
  );
};

export default Navbar;
