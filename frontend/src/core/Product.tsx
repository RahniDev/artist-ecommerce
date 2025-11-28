import { useState, useEffect } from "react";
import Layout from "./Layout";
import { read, listRelated } from "./apiCore";
import Card from "./Card";
import type { IProduct } from "../types";

const Product = (props: any) => {
    const [product, setProduct] = useState<IProduct | null>(null);
    const [related, setRelated] = useState<IProduct[]>([]);

    const loadSingleProduct = async (productId: string) => {
        const result = await read(productId);

        if ("error" in result) {
            console.error(result.error);
            return;
        }

        setProduct(result);

        const relatedProducts = await listRelated(result._id);
        setRelated(relatedProducts);
    };

    useEffect(() => {
        loadSingleProduct(props.match.params.productId);
    }, [props]);

    return (
        <Layout
            title={product?.name}
            description={product?.description?.substring(0, 100)}
            className="container-fluid"
        >
            <h2>Single Product</h2>

            <div className="row">
                <div className="col-8">
                    {product && <Card product={product} showViewProductButton={false} />}
                </div>

                <div className="col-4">
                    <h4>Related Products</h4>
                    {related.map((p) => (
                        <div key={p._id} className="mb-3">
                            <Card product={p} />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Product;
