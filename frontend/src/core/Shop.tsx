import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { getCategories, getFilteredProducts } from "./apiCore";
import { prices } from "./fixedPrices";

import type { ICategory, IProduct } from "../types";

interface FilterState {
  filters: {
    category: string[];
    price: number[];
  };
}

interface FilterResponse {
  data: IProduct[];
  size: number;
  error?: string;
}

const Shop: React.FC = () => {
  const [myFilters, setMyFilters] = useState<FilterState>({
    filters: { category: [], price: [] },
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState<number>(6);
  const [skip, setSkip] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [filteredResults, setFilteredResults] = useState<IProduct[]>([]);

  // Load categories
  const init = async () => {
    try {
      const data = await getCategories();
      if ("error" in data) setError(error);
      else setCategories(data);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    }
  };

  // Load filtered products
  const loadFilteredResults = async (filters: FilterState["filters"]) => {
    try {
      const data: FilterResponse = await getFilteredProducts(skip, limit, filters);
      if (data.error) setError(data.error);
      else {
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    }
  };

  // Load more products for pagination
  const loadMore = async () => {
    const toSkip = skip + limit;
    try {
      const data: FilterResponse = await getFilteredProducts(toSkip, limit, myFilters.filters);
      if (data.error) setError(data.error);
      else {
        setFilteredResults((prev) => [...prev, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load more products");
    }
  };

  const loadMoreButton = () =>
    size > 0 && size >= limit ? (
      <button onClick={loadMore} className="btn btn-warning mb-5">
        Load more
      </button>
    ) : null;

  useEffect(() => {
    init();
    loadFilteredResults(myFilters.filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Convert price _id to actual range [min, max]
  const handlePrice = (priceId: number): number[] => {
    const selected = prices.find((p) => p._id === priceId);
    return selected ? selected.array : [];
  };

  // Handle filters from Checkbox (category) or RadioBox (price)
  const handleFilters = (filter: string[] | number, filterBy: "category" | "price") => {
    const newFilters = { ...myFilters };
    if (filterBy === "price") {
      // `filter` is a single number from RadioBox
      newFilters.filters.price = handlePrice(filter as number);
    } else {
      newFilters.filters.category = filter as string[];
    }
    setMyFilters(newFilters);
    loadFilteredResults(newFilters.filters);
  };

  return (
    <Layout
      title="Shop Page"
      description="Browse through our selection of eco-friendly, high quality products."
      className="container-fluid"
    >
      <div className="row">
        {/* Filters column */}
        <div className="col-4">
          <h4>Filter by categories</h4>
          <ul>
            <Checkbox
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, "category")}
            />
          </ul>

          <h4>Filter by price range</h4>
          <RadioBox
            prices={prices}
            handleFilters={(selectedPrice) => handleFilters(selectedPrice, "price")}
          />
        </div>

        {/* Products column */}
        <div className="col-8">
          <h2 className="mb-4">Products</h2>
          <div className="row">
            {filteredResults.map((product) => (
              <div key={product._id} className="col-4 mb-3">
                <Card product={product} />
              </div>
            ))}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
