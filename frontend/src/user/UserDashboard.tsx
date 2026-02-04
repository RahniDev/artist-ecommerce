import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useTranslation } from 'react-i18next';
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getPurchaseHistory } from "./apiUser";
import type { Order, AuthResponse } from '../types'
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Typography,
    Alert,
    Grid,
    Divider,
    Link as MuiLink,
} from "@mui/material";

const UserDashboard = () => {
    const [history, setHistory] = useState<Order[]>([]);
    const { t } = useTranslation();
    const auth = isAuthenticated() as AuthResponse | false;
    if (!auth) {
        // Safety guard — should never happen due to PrivateRoute
        return <></>;
    }

    const {
        user: { _id, name, email, role },
        token,
    } = auth;

    const loadPurchaseHistory = async () => {
        const res = await getPurchaseHistory(_id, token);

        if (res.error) {
            console.error(res.error);
            return;
        }


        setHistory(
            (res.data ?? []).map(order => ({
                ...order,
                _id: order._id ?? "temp-id",
            }))
        );

    };

    useEffect(() => {
        loadPurchaseHistory();
    }, []);

    const userLinks = () => (
        <Card>
            <CardHeader title="User Links" />
            <List>
                <ListItem>
                    <MuiLink component={Link} to="/cart" underline="none">
                        My Cart
                    </MuiLink>
                </ListItem>
                <ListItem>
                    <MuiLink component={Link} to={`/profile/${_id}`} underline="none">
                        Update Profile
                    </MuiLink>
                </ListItem>
            </List>
        </Card>
    );

    const userInfo = () => (
        <Card sx={{ mb: 4 }}>
            <CardHeader title={t('user_info')} />
            <List>
                <ListItem>
                    <ListItemText primary={name} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={email} />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={role === 1 && "Admin"}
                    />
                </ListItem>
            </List>
        </Card>
    );

    const purchaseHistory = () => {
        if (history.length === 0) {
            return (
                <Alert severity="info">
                    {t('no_orders')}
                </Alert>
            );
        }

        return (
            <Card sx={{ mb: 4 }}>
                <CardHeader title={t('purchase_history')} />
                <CardContent>
                    {history.map(order => (
                        <Box key={order._id} sx={{ mb: 3 }}>
                            <Divider sx={{ mb: 2 }} />
                            {order.products.map(product => (
                                <Box key={product._id} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2">
                                        Product name: {product.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        Product price: €{product.price}
                                    </Typography>
                                    {product.createdAt && (
                                        <Typography variant="body2" color="text.secondary">
                                            Purchased: {moment(product.createdAt).fromNow()}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    ))}
                </CardContent>
            </Card>
        );
    };

    return (
        <Layout title={`${name}'s Account`} description="">
            <Grid container spacing={3}>
                <Box>
                    {userLinks()}
                </Box>

                <Box>
                    {userInfo()}
                    {purchaseHistory()}
                </Box>
            </Grid>
        </Layout>
    );
}

export default UserDashboard;