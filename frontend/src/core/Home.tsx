import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";
import type { IProduct, ApiResponse } from "../types";

const Home: React.FC = () => {
    const [productsBySell, setProductsBySell] = useState<IProduct[]>([]);
    const [productsByArrival, setProductsByArrival] = useState<IProduct[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadProductsBySell = async () => {
        try {
            const data: ApiResponse<IProduct[]> = await getProducts("sold");
            if (data.error) {
                setError(data.error);
            } else if (data.data) {
                setProductsBySell(data.data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load best sellers");
        }
    };

    const loadProductsByArrival = async () => {
        try {
            const data: ApiResponse<IProduct[]> = await getProducts("createdAt");
            if (data.error) {
                setError(data.error);
            } else if (data.data) {
                setProductsByArrival(data.data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load new arrivals");
        }
    };

    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, []);

    return (
        <Layout
            title="Home Page"
            description="Make changes now, live sustainably and help save our planet!"
            className="container-fluid"
        >
            <Search />
            {error && <div className="alert alert-danger">{error}</div>}

            <h2 className="text-center">New Arrivals</h2>
            <div className="row">
                {productsByArrival.map((product) => (
                    <div key={product._id} className="col-4 mb-3">
                        <Card product={{ ...product, count: 1 }} />
                    </div>
                ))}
            </div>

            <h2 className="text-center">Best Sellers</h2>
            <div className="row">
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
