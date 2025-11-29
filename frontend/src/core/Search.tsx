import React, { useState, useEffect } from "react";
import { getCategories, list } from "./apiCore";
import Card from "./Card";
import type { ICategory, IProduct } from "../types";

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

    if ("error" in result) {
      console.error(result.error);
    } else {
      setData((prev) => ({ ...prev, categories: result }));
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const searchData = async () => {
    if (!search) return;

    const response = await list({
      search: search || undefined,
      category,
    });

    if ("error" in response) {
      console.error(response.error);
    } else {
      setData((prev) => ({
        ...prev,
        results: response,
        searched: true,
      }));
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
    if (searched && results.length > 0) return `Found ${results.length} products`;
    if (searched && results.length < 1) return "No products found";
    return "";
  };

  const searchedProducts = (results: IProduct[]) => (
    <div>
      <h2 className="mt-4 mb-4">{searchMessage(searched, results)}</h2>
      <div className="row">
        {results.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </div>
    </div>
  );

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <select className="btn mr-2" onChange={handleChange("category")}>
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