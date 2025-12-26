import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import ProductCard from "./Card";
import { read, listRelated } from "./apiCore";
import type { IProduct } from "../types";

const Product: React.FC = () => {

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);

  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    if (!productId) return;

    const loadSingleProduct = async () => {
      const productRes = await read(productId);

      if (productRes.error) {
        console.error(productRes.error);
        return;
      }

      setProduct(productRes.data!);

      const relatedRes = await listRelated(productId);
      if (!relatedRes.error) {
        setRelated(relatedRes.data?.data ?? []);
      }
    };

    loadSingleProduct();
  }, [productId]);

  return (
    <Layout
      title={product?.name}
      description={product?.description?.substring(0, 100)}
      className="container-fluid"
    >
      {/* single product */}
      <div className="row">
        <div className="col-8">
          {product && <ProductCard product={{ ...product, count: 1 }} showViewProductButton={false} />}
        </div>
        <div className="col-4">
          <h4>Related Products</h4>
          {related.map((p) => (
            <div key={p._id} className="mb-3">
              <ProductCard product={{ ...p, count: 1 }} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
