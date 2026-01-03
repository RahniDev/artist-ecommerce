import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import type { CartItem } from "../types";
import Card from "./Card";
import Checkout from "./Checkout";
import { useTranslation } from "react-i18next";

const Cart: React.FC = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [run, setRun] = useState<boolean>(false);

  const { t } = useTranslation();

    useEffect(() => {
        setItems(getCart());
    }, [run]);

    const showItems = (items: CartItem[]) => (
        <div>
            <h2>{t("Your cart has {items.length} items")}</h2>
            <hr />
            {items.map((product) => (
                <Card
                    key={product._id}
                    product={product}
                    showAddToCartButton={false}
                    cartUpdate={true}
                    showRemoveProductButton={true}
                    setRun={setRun}
                    run={run}
                />
            ))}
        </div>
    );

    const noItemsMessage = () => (
        <h2>
            Your Cart is empty. <br />
            <Link to="/shop">Continue shopping.</Link>
        </h2>
    );

    return (
        <Layout
            title="Shopping Cart"
            description="Checkout now!"
        >
            <div className="row">
                <div className="col-6">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </div>

                <div className="col-6">
                    <h2 className="mb-4">Your Cart Summary</h2>
                    <hr />
                    <Checkout products={items} setRun={setRun} run={run} />
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
