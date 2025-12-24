import React, { useState, useEffect } from "react";
import { getCategories, list } from "./apiCore";
import Card from "./Card";
import type { ICategory, IProduct, ApiResponse } from "../types";

interface SearchState {
  categories: ICategory[];
  category: string;
  search: string;
  results: IProduct[];
  searched: boolean;
}

const Search: React.FC = () => {
  const [data, setData] = useState<SearchState>({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });

  const { categories, category, search, results, searched } = data;

const loadCategories = async () => {
  const result = await getCategories();

  if (result.error) {
    console.error(result.error);
    setData((prev) => ({
      ...prev,
      categories: [], // always array
    }));
    return;
  }

  // ✅ Ensure categories is ALWAYS an array
  setData((prev) => ({
    ...prev,
    categories: Array.isArray(result.data) ? result.data : [],
  }));
};

  useEffect(() => {
    loadCategories();
  }, []);

  const searchData = async () => {
    if (!search) return;

    try {
      const res: ApiResponse<IProduct[]> = await list({
        search,
        category,
      });

      if (res.error) {
        console.error("Search failed:", res.error);
        setData((prev) => ({ ...prev, results: [], searched: true }));
      } else {
        setData((prev) => ({
          ...prev,
          results: res.data || [],
          searched: true,
        }));
      }
    } catch (err: any) {
      console.error("Search error:", err.message || err);
      setData((prev) => ({ ...prev, results: [], searched: true }));
    }
  };

  const searchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchData();
  };

  const handleChange =
    (name: "category" | "search") =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData((prev) => ({
          ...prev,
          [name]: e.target.value,
          searched: false,
        }));
      };

  const searchMessage = (searched: boolean, results: IProduct[]) => {
    if (!searched) return "";
    return results.length > 0
      ? `Found ${results.length} products`
      : "No products found";
  };

  const searchedProducts = (results: IProduct[]) => (
    <div>
      <h2 className="mt-4 mb-4">{searchMessage(searched, results)}</h2>
      <div className="row">
        {results.map((product) => (
          <div key={product._id} className="col-4 mb-3">
            <Card product={product} />
          </div>
        ))}
      </div>
    </div>
  );

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <select
              className="btn mr-2"
              value={category}
              onChange={handleChange("category")}
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="search"
            className="form-control"
            value={search}
            onChange={handleChange("search")}
            placeholder="Search by name"
          />
        </div>

        <div className="btn input-group-append" style={{ border: "none" }}>
          <button className="input-group-text">Search</button>
        </div>
      </span>
    </form>
  );

  return (
    <div className="row">
      <div className="container mb-3">{searchForm()}</div>
      <div className="container-fluid mb-3">{searchedProducts(results)}</div>
    </div>
  );
};

export default Search;
