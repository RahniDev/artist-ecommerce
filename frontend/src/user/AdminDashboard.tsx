import { Link as RouterLink } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import type { IUser } from "../types";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AdminStats from "./AdminStats";

const AdminDashboard: React.FC = () => {
  const auth = isAuthenticated();

  if (!auth || auth.user.role !== 1) {
    return (
      <Layout title="Admin Dashboard" description="Please sign in">
        <Typography variant="h4" align="center">
          Please sign in to view this page.
        </Typography>
      </Layout>
    );
  }

  const { user } = auth;
  const { name, email } = user as IUser;

  return (
    <Layout title="Admin Dashboard" description={`Hi ${name}!`}>
      <Grid container spacing={3} sx={{ pl: { xs: 2, md: 4 } }}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Stack spacing={2}>
            <Card>
              <CardHeader title="Manage Shop" />
              {/* Admin Links */}
              <List disablePadding>
                <ListItemButton component={RouterLink} to="/create/category">
                  <ListItemText primary="Create Category" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/create/product">
                  <ListItemText primary="Create Product" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/admin/orders">
                  <ListItemText primary="View Orders" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/admin/products">
                  <ListItemText primary="Manage Products" />
                </ListItemButton>
              </List>
            </Card>

            <Card>
              <CardHeader title="Admin Info" />
              <List>
                <ListItem>
                  <ListItemText primary={name} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={email} />
                </ListItem>
              </List>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AdminStats />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AdminDashboard;
