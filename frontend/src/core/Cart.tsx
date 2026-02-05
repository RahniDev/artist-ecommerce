import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import Layout from "./Layout";
import type { CartItem } from "../types";
import Checkout from "./Checkout";
import { useTranslation } from "react-i18next";
import {
    Box,
    Grid,
    Link,
    Typography,
    Card,
    CardContent,
    Divider,
    Container,
} from "@mui/material";
import CartItemControls from "./CartItemControls";
import ShowImage from "./ShowImage";
import { Link as RouterLink } from "react-router-dom";
import CartBreadcrumbs from "./CartBreadcrumbs";

const Cart: React.FC = () => {
    const items = useSelector((state: RootState) => state.cart.items);
    const { t } = useTranslation();

    const showItems = (items: CartItem[]) => (
        <Box>
            <Typography variant="h5" gutterBottom>
                {t(
                    `Your cart has ${items.length} ${items.length === 1 ? "item" : "items"
                    }`
                )}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {items.map((product) => (
                <Card key={product._id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            {/* Image */}
                            <Grid>
                                <Link
                                    component={RouterLink}
                                    to={`/product/${product._id}`}
                                    underline="none"
                                >
                                    <ShowImage
                                        item={product}
                                        width="120px"
                                        height="120px"
                                        url="product"
                                    />
                                </Link>
                            </Grid>

                            {/* Info */}
                            <Grid>
                                <Typography
                                    variant="subtitle1"
                                    component={RouterLink}
                                    to={`/product/${product._id}`}
                                    sx={{ textDecoration: "none", color: "text.primary" }}
                                >
                                    {product.name}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    € {product.price}
                                </Typography>
                            </Grid>

                            {/* Controls */}
                            <Grid
                                sx={{ display: "flex", justifyContent: { sm: "flex-end" } }}
                            >
                                <CartItemControls
                                    productId={product._id}
                                    initialCount={product.count ?? 1}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );

    const noItemsMessage = () => (
        <Box textAlign="center" mt={4}>
            <Typography variant="h5" gutterBottom>
                {t("empty_cart")}
            </Typography>
            <Link component={RouterLink} to="/">
                {t("continue_shopping")}
            </Link>
        </Box>
    );

    return (
        <Layout title="" description="">
            <Container maxWidth="md">
                <CartBreadcrumbs />
                {items.length > 0 ? showItems(items) : noItemsMessage()}

                {items.length > 0 && (
                    <>
                        <Divider sx={{ my: 3 }} />
                        <Checkout />
                    </>
                )}
            </Container>
        </Layout>
    );
};

export default Cart;