import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { listOrders } from "../admin/apiAdmin";
import Loader from "../core/Loader";

import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const AdminStats: React.FC = () => {
    const { user, token, isAuthenticated: loggedIn } = useSelector((state: RootState) => state.auth);
    const [totalOrders, setTotalOrders] = useState<number | null>(null);

    useEffect(() => {
        if (!loggedIn || !user || !token) {
            setTotalOrders(0);
            return;
        }
        const loadTotalOrders = async () => {
            try {
                const res = await listOrders(user._id, token);
                setTotalOrders(Array.isArray(res.data) ? res.data.length : 0);
            } catch (err) {
                console.error("Failed to load total orders", err);
            }
        };
        loadTotalOrders();
    }, [loggedIn, user, token]);

    return (
        <Card sx={{ width: 360 }}>
            <CardHeader title="Total Orders" />
            <CardContent>
                {totalOrders === null ? (
                    <Loader loading={true} />
                ) : (
                    <Typography variant="h4" align="center">
                        {totalOrders}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default AdminStats;
