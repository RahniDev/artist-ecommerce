import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";
import type { IOrder, IAuthData } from "../types";
import {
    Box,
    Container,
    Typography,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    List,
    ListItem,
    Divider
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import ShowImage from "../core/ShowImage";

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [statusValues, setStatusValues] = useState<string[]>([]);

    const { user, token } = isAuthenticated() as IAuthData;

    const loadOrders = async () => {
        try {
            const res = await listOrders(user._id, token);
            console.log("Orders response:", res);
            if (!res.error) setOrders(res as any);
        } catch (err) {
            console.error("Failed to load orders", err);
        }
    };

    const loadStatusValues = async () => {
        try {
            const data = await getStatusValues(user._id, token);
            setStatusValues(data);
        } catch (err) {
            console.error("Failed to load status values", err);
        }
    };

    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, []);

    const handleStatusChange = async (
        e: SelectChangeEvent<string>,
        orderId: string
    ) => {
        try {
            const res = await updateOrderStatus(
                user._id,
                token,
                orderId,
                e.target.value
            );
            if (!res.error) await loadOrders();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    return (
        <Layout
            title="Orders"
            description={""}
        >
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" color="error" gutterBottom>
                        {orders.length > 0
                            ? `Total orders: ${orders.length}`
                            : "No orders"}
                    </Typography>
                    {orders.map((order) => (
                        <Paper
                            key={order._id}
                            sx={{
                                mt: 4,
                                p: 3,
                                borderLeft: "6px solid indigo",
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Order ID: {order._id}
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(e, order._id)}
                                >
                                    {statusValues.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <List dense>
                                <ListItem>Transaction ID: {order.transaction_id}</ListItem>
                                <ListItem>Total: £{order.amount}</ListItem>
                                <ListItem>Ordered by: {order.firstName} {order.lastName}</ListItem>
                                <ListItem>
                                    Ordered on: {moment(order.createdAt).format('D-MM-YY')}
                                </ListItem>
                                <ListItem>Delivery address: {order.address}</ListItem>
                            </List>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                Total products: {order.products.length}
                            </Typography>

                            {order.products.map((p) => (
                                <Paper
                                    key={p.product as string}
                                    variant="outlined"
                                    sx={{ p: 2, mb: 2 }}
                                >
                                    <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                                        Painting Name: {typeof p.product === "object" ? p.product.name : p.name}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                                        Price: £{typeof p.product === "object" ? p.product.price : p.price}
                                    </Typography>

                                    <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                                        Quantity: {p.count ?? 0}
                                    </Typography>

                                    <Typography>
                                        Product ID: {p._id}
                                    </Typography>
                                </Paper>
                            ))}

                        </Paper>
                    ))}
                </Box>
            </Container>
        </Layout>
    );
};

export default Orders;
