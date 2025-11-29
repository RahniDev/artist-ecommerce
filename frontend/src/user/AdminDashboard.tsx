import React from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import type { IUser } from "../types";

const AdminDashboard: React.FC = () => {
    const auth = isAuthenticated();
    if (!auth) {
        return (
            <Layout title="Dashboard" description="Please sign in" className="container-fluid">
                <h2>Please sign in to view this page.</h2>
            </Layout>
        );
    }

    const { user } = auth as { user: IUser }; 
    
    const { name, email, role } = user;

    const adminLinks = () => (
        <div className="card">
            <h4 className="card-header">Admin Links</h4>
            <ul className="list-group">
                <li className="list-group-item">
                    <Link className="nav-link" to="/create/category">
                        Create Category
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to="/create/product">
                        Create Product
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to="/admin/orders">
                        View Orders
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to="/admin/products">
                        Manage Products
                    </Link>
                </li>
            </ul>
        </div>
    );

    const adminInfo = () => (
        <div className="card mb-5">
            <h3 className="card-header">User Information</h3>
            <ul className="list-group">
                <li className="list-group-item">{name}</li>
                <li className="list-group-item">{email}</li>
                <li className="list-group-item">{role === 1 ? "Admin" : "Registered User"}</li>
            </ul>
        </div>
    );

    return (
        <Layout
            title="Dashboard"
            description={`G'day ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">{adminLinks()}</div>
                <div className="col-9">{adminInfo()}</div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
