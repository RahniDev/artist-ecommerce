import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import Layout from "./Layout";
import type { CartItem } from "../types";
import Checkout from "./Checkout";
import { useTranslation } from "react-i18next";
import { Box, Grid, Link } from "@mui/material";
import CartItemControls from "./CartItemControls";
import ShowImage from "./ShowImage";

const Cart: React.FC = () => {
    const items = useSelector((state: RootState) => state.cart.items); // Redux source of truth
    const { t } = useTranslation();

    const showItems = (items: CartItem[]) => (
        <Box>
            <h2>
                {t(
                    `Your cart has ${items.length} ${items.length === 1 ? "item" : "items"}`
                )}
            </h2>

            <hr />

            {items.map((product) => (
                <Grid
                    container
                    key={product._id}
                    alignItems="center"
                    sx={{
                        mb: 2,
                        p: 2,
                        borderBottom: "1px solid #eee",
                        width: "100%",
                    }}
                >
                    <Grid>
                        <Link href={`/product/${product._id}`}>
                            <ShowImage
                                item={product}
                                width="120px"
                                height="120px"
                                url="product"
                            />
                        </Link>
                    </Grid>

                    <Grid>
                        <Link href={`/product/${product._id}`}>
                            <h3 style={{ margin: 0 }}>{product.name}</h3>
                        </Link>
                        <p style={{ margin: 0 }}>€ {product.price}</p>
                    </Grid>

                    <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <CartItemControls
                            productId={product._id}
                            initialCount={product.count ?? 1}
                        />
                    </Grid>
                </Grid>
            ))}
        </Box>
    );

    const noItemsMessage = () => (
        <h2>
            Your Cart is empty. <br />
            <Link href="/">Continue shopping.</Link>
        </h2>
    );

    return (
        <Layout title="Shopping Cart" description="">
            <Box>
                {items.length > 0 ? showItems(items) : noItemsMessage()}
            </Box>

            <div>
                <hr />
                <Checkout />
            </div>
        </Layout>
    );
};

export default Cart;