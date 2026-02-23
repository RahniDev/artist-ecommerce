import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getProducts, deleteProduct } from "./apiAdmin";
import type { Product, IAuthData } from "../types";
import Loader from "../core/Loader";
import ManageProductRow from "./ManageProductRow";
import {
    Container,
    Typography,
    Divider,
    Alert,
    List,
    Box,
} from "@mui/material";

const ManageProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { user, token } = isAuthenticated() as IAuthData;

    const loadProducts = React.useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getProducts();
            if (data.error) {
                setError(data.error);
            } else {
                setProducts(data.data || []);
            }
        } catch {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    }, []);

    const destroy = async (productId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (!confirmed) return;

        try {
            const data = await deleteProduct(productId, user._id, token);
            if (data.error) {
                setError(data.error);
            } else {
                setProducts(prev => prev.filter(p => p._id !== productId));
            }
        } catch {
            setError("Failed to delete product");
        }
    };

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return (
        <Layout
            title="Manage Products"
            description="Update and delete products"
        >
            <Container maxWidth="md">
                {loading && <Loader loading={loading} />}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Total {products.length} {products.length === 1 ? "product" : "products"}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <List disablePadding>
                        {products.map((p) => (
                            <ManageProductRow
                                key={p._id}
                                product={p}
                                onDelete={destroy}
                            />
                        ))}
                    </List>
                </Box>
            </Container>
        </Layout>
    );
};

export default ManageProducts;