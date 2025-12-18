import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getPurchaseHistory } from "./apiUser";

interface Product {
    _id: string;
    name: string;
    price: number;
    createdAt?: string;
}

interface Order {
    _id: string;
    products: Product[];
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: number;
}

interface AuthResponse {
    user: User;
    token: string;
}

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

const UserDashboard = () => {
    const [history, setHistory] = useState<Order[]>([]);

    const auth = isAuthenticated() as AuthResponse | false;

    if (!auth) {
        // Safety guard — should never happen due to PrivateRoute
        return <></>;
    }

    const {
        user: { _id, name, email, role },
        token,
    } = auth;

    const loadPurchaseHistory = async (): Promise<void> => {
        try {
            const res: ApiResponse<Order[]> = await getPurchaseHistory(_id, token);

            if (res.error) {
                console.error(res.error);
                return;
            }

            setHistory(res.data ?? []);
        } catch (err) {
            console.error("Failed to load purchase history");
        }
    };

    useEffect(() => {
        loadPurchaseHistory();
    }, []);

    const userLinks = () => (
        <div className="card">
            <h4 className="card-header">User Links</h4>
            <ul className="list-group">
                <li className="list-group-item">
                    <Link className="nav-link" to="/cart">
                        My Cart
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to={`/profile/${_id}`}>
                        Update Profile
                    </Link>
                </li>
            </ul>
        </div>
    );

    const userInfo = () => (
        <div className="card mb-5">
            <h3 className="card-header">User Information</h3>
            <ul className="list-group">
                <li className="list-group-item">{name}</li>
                <li className="list-group-item">{email}</li>
                <li className="list-group-item">
                    {role === 1 ? "Admin" : "Registered User"}
                </li>
            </ul>
        </div>
    );

    const purchaseHistory = () => (
        <div className="card mb-5">
            <h3 className="card-header">Purchase History</h3>
            <ul className="list-group">
                <li className="list-group-item">
                    {history.map((order) => (
                        <div key={order._id}>
                            <hr />
                            {order.products.map((product) => (
                                <div key={product._id}>
                                    <h6>Product name: {product.name}</h6>
                                    <h6>Product price: ${product.price}</h6>
                                    {product.createdAt && (
                                        <h6>
                                            Purchased date:{" "}
                                            {moment(product.createdAt).fromNow()}
                                        </h6>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </li>
            </ul>
        </div>
    );

    return (
        <Layout
            title={`${name}'s Account`}
            description=""
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">{userLinks()}</div>
                <div className="col-9">
                    {userInfo()}
                    {purchaseHistory()}
                </div>
            </div>
        </Layout>
    );
}

export default UserDashboard;