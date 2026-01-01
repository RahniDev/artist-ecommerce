import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import type { IUser } from "../types";
import { Card, CardHeader, List, ListItem, ListItemButton, ListItemText, Grid } from "@mui/material";

const AdminDashboard: React.FC = () => {
    const auth = isAuthenticated();
    if (!auth) {
        return (
            <Layout title="Dashboard" description="Please sign in">
                <h2>Please sign in to view this page.</h2>
            </Layout>
        );
    }

    const { user } = auth as { user: IUser };

    const { name, email, role } = user;

    const adminLinks = () => (
        <Card sx={{ width: 360 }}>
            <CardHeader title="Manage Shop" />
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
    );

    const adminInfo = () => (
        <Card sx={{ width: 360 }}>
            <CardHeader title="Admin Info" />
            <List>
                <ListItem>
                    <ListItemText primary={name} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={email} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={role === 1 && "Admin"} />
                </ListItem>
            </List>
        </Card>
    );

    return (
        <Layout title=""
            description={`Hi ${name}!`}>
            <Grid>
                {adminLinks()}
                {adminInfo()}
            </Grid>
        </Layout>
    );
};

export default AdminDashboard;