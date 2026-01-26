import { useState, useEffect } from "react";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import type { CartItem } from "../types";
import Checkout from "./Checkout";
import { useTranslation } from "react-i18next";
import { Box, Grid, Link } from "@mui/material";
import CartItemControls from "./CartItemControls";

const Cart: React.FC = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [run, setRun] = useState<boolean>(false);

    const { t } = useTranslation();

    useEffect(() => {
        setItems(getCart());
    }, [run]);

    const showItems = (items: CartItem[]) => (
        <div>
            <h2>{t(`Your cart has ${items.length} items`)}</h2>
            <hr />
            {items.map((product) => (
                <Grid container>
                <Grid key={product._id} sx={{ mb: 2, display: 'flex', mx: 'auto', justifyContent: 'space-between'}}>
                    <strong>{product.name}</strong>
                    <div>€ {product.price}</div>

                    <CartItemControls
                        productId={product._id}
                        initialCount={product.count ?? 1}
                        run={run}
                        setRun={setRun}
                    />
                </Grid>
                </Grid>
            ))}
        </div>
    );

    const noItemsMessage = () => (
        <h2>
            Your Cart is empty. <br />
            <Link href="/shop">Continue shopping.</Link>
        </h2>
    );

    return (
        <Layout
            title="Shopping Cart"
            description=""
        >     
                <Box>
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </Box>

                <div>
                    <hr />
                    <Checkout products={items} setRun={setRun} run={run} />
                </div>
        </Layout>
    );
};

export default Cart;
