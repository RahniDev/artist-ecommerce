import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import Card from "./Card";
import { read, listRelated } from "./apiCore";
import type { IProduct, ApiResponse } from "../types";

const Product: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);

  useEffect(() => {
    if (!productId) return;

    const loadSingleProduct = async (id: string) => {
      const productRes: IProduct | ApiResponse<IProduct> = await read(id);

      if ("error" in productRes) {
        console.error(productRes.error);
        return;
      }

      setProduct(productRes as IProduct);

      const relatedRes: ApiResponse<IProduct[]> = await listRelated(id);
      if (relatedRes.error) {
        console.error(relatedRes.error);
      } else if (relatedRes.data) {
        setRelated(relatedRes.data);
      }
    };

    loadSingleProduct(productId);
  }, [productId]);

  return (
    <Layout
      title={product?.name}
      description={product?.description?.substring(0, 100)}
      className="container-fluid"
    >
      <h2>Single Product</h2>
      <div className="row">
        <div className="col-8">
          {product && <Card product={{ ...product, count: 1 }} showViewProductButton={false} />}
        </div>
        <div className="col-4">
          <h4>Related Products</h4>
          {related.map((p) => (
            <div key={p._id} className="mb-3">
              <Card product={{ ...p, count: 1 }} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
