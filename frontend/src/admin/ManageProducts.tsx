import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getProducts, deleteProduct } from "./apiAdmin";
import type { Product } from "./apiAdmin";

interface AuthUser {
    _id: string;
    name: string;
    email: string;
    role: number;
}

interface AuthData {
    user: AuthUser;
    token: string;
}

const ManageProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const { user, token } = isAuthenticated() as AuthData;

    const loadProducts = async () => {
        const data = await getProducts();
        if (data.error) {
            console.error(data.error);
        } else {
            setProducts(data.data || []);
        }
    };


    const destroy = async (productId: string) => {
        try {
            const data = await deleteProduct(productId, user._id, token);
            if (data.error) {
                console.error(data.error);
            } else {
                await loadProducts();
            }
        } catch (err) {
            console.error("Failed to delete product", err);
        }
    };

    // Load products on mount
    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <Layout
            title="Manage Products"
            description="Update and delete products"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center">Total {products.length} products</h2>
                    <hr />
                    <ul className="list-group">
                        {products.map((p) => (
                            <li
                                key={p._id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <strong>{p.name}</strong>
                                <Link to={`/admin/product/update/${p._id}`}>
                                    <span className="badge badge-warning badge-pill">Update</span>
                                </Link>
                                <span
                                    onClick={() => destroy(p._id)}
                                    className="badge badge-danger badge-pill"
                                    style={{ cursor: "pointer" }}
                                >
                                    Delete
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default ManageProducts;