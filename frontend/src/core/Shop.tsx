import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import ProductCard from "./Card";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { getCategories, getFilteredProducts } from "./apiCore";
import { prices } from "./fixedPrices";
import Grid from "@mui/material/Grid";
import type { ICategory, IProduct, FilterState } from "../types";

const Shop: React.FC = () => {
  const [myFilters, setMyFilters] = useState<FilterState>({
    filters: { category: [], price: [] },
  });

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filteredResults, setFilteredResults] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [limit] = useState<number>(6);
  const [skip, setSkip] = useState<number>(0);
  const [size, setSize] = useState<number>(0);

  const init = async () => {
    const res = await getCategories();
    if (res.error) {
      setError(res.error);
    } else {
      setCategories(res.data ?? []);
    }
  };

  const loadFilteredResults = async (filters: FilterState["filters"]) => {
    const res = await getFilteredProducts(0, limit, filters);

    if (res.error) {
      setError(res.error);
    } else {
      setFilteredResults(res.data?.data ?? []);
      setSize(res.data?.size ?? 0);
      setSkip(0);
    }
  };

  const loadMore = async () => {
    const toSkip = skip + limit;

    const res = await getFilteredProducts(toSkip, limit, myFilters.filters);

    if (res.error) {
      setError(res.error);
    } else {
      setFilteredResults((prev) => [
        ...prev,
        ...(res.data?.data ?? []),
      ]);
      setSize(res.data?.size ?? 0);
      setSkip(toSkip);
    }
  };

  const loadMoreButton = () =>
    size > 0 && size >= limit ? (
      <button onClick={loadMore}>
        Load more
      </button>
    ) : null;

  useEffect(() => {
    init();
    loadFilteredResults(myFilters.filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrice = (priceId: number): number[] => {
    const selected = prices.find((p) => p._id === priceId);
    return selected ? selected.array : [];
  };

  const handleFilters = (
    filter: string[] | number,
    filterBy: "category" | "price"
  ) => {
    const newFilters = { ...myFilters };

    if (filterBy === "price") {
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
      description=""
    >
      {error && (
        <div>{error}</div>
      )}

      <Grid container spacing={2}>
        <Grid size={3} className="mb-3">
          <h4>Filter by categories</h4>
            <Checkbox
              categories={categories}
              handleFilters={(filters) =>
                handleFilters(filters, "category")
              }
            />

          <h4>Filter by price range</h4>
          <RadioBox
            prices={prices}
            handleFilters={(selectedPrice) =>
              handleFilters(selectedPrice, "price")
            }
          />
        </Grid>

        <Grid size={9}>

          <h2 className="mb-4">Products</h2>
          <Grid container spacing={2}>
            {filteredResults.map((product) => (
              <Grid size={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          {loadMoreButton()}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Shop;