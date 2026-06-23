import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
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
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [collectionsOpen, setCollectionsOpen] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + (item.count ?? 1), 0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleSignout = () => {
    dispatch(clearAuth());
    navigate("/");
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();

      if (res.error) {
        console.error(res.error);
        return;
      }

      setCategories(res.data ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <List sx={{ width: 280 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/about");
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Collections" />
          </ListItemButton>
        </ListItem>

        {categories.map(category => (
          <ListItem key={category._id} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(`/category/${category._id}`);
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  const DesktopLinks = () => (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        gap: 3,
        fontWeight: 500,
      }}
    >
      <NavLink to="/about" style={linkStyle}>
        About
      </NavLink>
      <NavLink to="/shop" style={linkStyle}>Shop</NavLink>
     <Box
  sx={{ position: "relative" }}
  onMouseEnter={() => setCollectionsOpen(true)}
  onMouseLeave={() => setCollectionsOpen(false)}
>
  <Box
    component="span"
    sx={{
      ...linkStyle,
      cursor: "pointer",
      display: "inline-block",
    }}
  >
    Collections
  </Box>

  {collectionsOpen && (
    <Box
      sx={{
        position: "absolute",
        top: "100%",
        left: "5%",
        transform: "translateX(-5%)",
        bgcolor: "white",
        color: "#3a3535",
        boxShadow: 3,
        minWidth: 220,
        zIndex: 1300,
      }}
    >
      {categories.map((category) => (
        <Box
          key={category._id}
          sx={{
            px: 2,
            py: 1,
            cursor: "pointer",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
          onClick={() => navigate(`/category/${category._id}`)}
        >
          {category.name}
        </Box>
      ))}
    </Box>
  )}
</Box>
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
          {user ? (
            <>
              <IconButton onMouseEnter={handleMouseEnter} sx={{ color: "#3a3535" }}>
                <Person2OutlinedIcon fontSize="medium" />
              </IconButton>
              <Menu anchorEl={anchorEl}
                disableAutoFocus
                disableEnforceFocus
                open={open}
                onClose={handleMouseLeave}
                MenuListProps={{
                  autoFocusItem: false,
                }}
                slotProps={{
                  paper: {
                    onMouseLeave: handleMouseLeave,
                  },
                }}>
                {user?.role === 0 && (
                  <MenuItem onClick={() => {
                    navigate("/user/dashboard");
                    handleMouseLeave();
                  }}>
                    Dashboard
                  </MenuItem>
                )}
                {user?.role === 1 && (
                  <MenuItem sx={{
                    "&.Mui-focusVisible": {
                      backgroundColor: "transparent",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "transparent",
                    },
                  }} onClick={() => { navigate("/admin/dashboard"); handleMouseLeave(); }}>
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
