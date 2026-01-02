import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import type { IUser, IAuthData } from "../types";
import { Card, CardHeader, List, ListItem, ListItemButton, ListItemText, Grid, CardContent, Stack } from "@mui/material";
import { listOrders } from "../admin/apiAdmin";

const AdminDashboard: React.FC = () => {
    const [totalOrders, setTotalOrders] = useState<number>(0);
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

    useEffect(() => {
        const loadTotalOrders = async () => {
            try {
                const { user, token } = isAuthenticated() as IAuthData;
                const data = await listOrders(user._id, token);

                if (!data.error && data.data) {
                    setTotalOrders(data.data.length);
                }
            } catch (err) {
                console.error("Failed to load total orders", err);
            }
        };
        loadTotalOrders();
    }, []);

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

    const adminStats = () => (
        <Card sx={{ width: 360 }}>
            <CardHeader title="Total Orders" />
            <CardContent>
                <h2>{totalOrders}</h2>
            </CardContent>
        </Card>
    )

    return (
        <Layout title=""
            description={`Hi ${name}!`}>
            <Grid container spacing={3} sx={{ pl: { xs: 2, md: 4 } }}>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Stack spacing={2}>
                    {adminLinks()}
                    {adminInfo()}
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    {adminStats()}
                </Grid>
            </Grid>
        </Layout>
    );
};

export default AdminDashboard;