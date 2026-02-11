import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { listOrders } from "../admin/apiAdmin";
import { isAuthenticated } from "../auth";
import type { IAuthData } from "../types";
import Loader from "../core/Loader";

const AdminStats: React.FC = () => {
    const [totalOrders, setTotalOrders] = useState<number | null>(null);

    useEffect(() => {
        const loadTotalOrders = async () => {
            const auth = isAuthenticated() as IAuthData | null;
            if (!auth) {
                setTotalOrders(0);
                return;
            }

            try {
                const res = await listOrders(auth.user._id, auth.token);

                if (Array.isArray(res.data)) {
                    setTotalOrders(res.data.length);
                } else {
                    setTotalOrders(0);
                }
            } catch (err) {
                console.error("Failed to load total orders", err);
            }
        };

        loadTotalOrders();
    }, []);


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
