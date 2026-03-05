import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { IProduct } from "../types";
import { API } from "../config";

export const SubcategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    fetch(`${API}/products/subcategory/${categoryId}`)
      .then(res => {
        console.log("status:", res.status, "url:", res.url);
        return res.json();
      })
      .then(data => {
        console.log("data:", data.data);
        if (data.error) setError(data.error);
        else setProducts(data.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!products.length) return <div>No products found</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>
          <img src={`${API}/product/photo/${product._id}`} width="200px" alt={product.name} />
          <p>{product.name}</p>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
};