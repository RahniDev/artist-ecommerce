import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";
import Hero from "./Hero";
import type { IProduct, ApiResponse } from "../types";

const Home: React.FC = () => {
    const [productsBySell, setProductsBySell] = useState<IProduct[]>([]);
    const [productsByArrival, setProductsByArrival] = useState<IProduct[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Generic loader to reduce duplication
    const loadProducts = async (
        sortBy: string,
        setter: React.Dispatch<React.SetStateAction<IProduct[]>>
    ) => {
        try {
            setLoading(true);
            const response: ApiResponse<IProduct[]> = await getProducts(sortBy);

            if (response.error) {
                setError(response.error);
                setter([]);
            } else {
                setError(null);
                setter(response.data || []);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load products");
            setter([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts("createdAt", setProductsByArrival);
        loadProducts("sold", setProductsBySell);
    }, []);

    return (
        <Layout
            title="Home Page"
            description="Shop"
            className="container-fluid"
        >
            <Hero />
            <Search />

            {error && (
                <div className="alert alert-danger text-center my-3">
                    {error}
                </div>
            )}

            {loading && (
                <div className="alert alert-info text-center my-3">
                    Loading products...
                </div>
            )}

            <h2 className="text-center">New Arrivals</h2>
            <div className="row">
                {productsByArrival.length === 0 && !loading && !error && (
                    <p className="text-center text-muted w-100">
                        No new arrivals yet.
                    </p>
                )}

                {productsByArrival.map((product) => (
                    <div key={product._id} className="col-4 mb-3">
                        <Card product={{ ...product, count: 1 }} />
                    </div>
                ))}
            </div>

            <h2 className="text-center">Best Sellers</h2>
            <div className="row">
                {productsBySell.length === 0 && !loading && !error && (
                    <p className="text-center text-muted w-100">
                        No best sellers yet.
                    </p>
                )}

                {productsBySell.map((product) => (
                    <div key={product._id} className="col-4 mb-3">
                        <Card product={{ ...product, count: 1 }} />
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Home;