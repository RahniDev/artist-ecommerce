// AddCategory.tsx
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createCategory } from "./apiAdmin.ts";

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

interface ApiResponse {
    error?: string;
    name?: string;
}

const AddCategory: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string | boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const { user, token } = isAuthenticated() as AuthData;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(false);
        setName(e.target.value);
    };

    const clickSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false);
        setSuccess(false);

        try {
            const data: ApiResponse = await createCategory(user._id, token, { name });

            if (data.error) {
                setError(data.error);
            } else {
                setError(false);
                setSuccess(true);
                setName(""); // clear input after success
            }
        } catch (err) {
            console.error("Category creation failed:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    const newCategoryForm = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                />
            </div>
            <button className="btn btn-dashboard btn-outline-primary">Create Category</button>
        </form>
    );

    const showSuccess = () =>
        success && <h3 className="text-success">{name || "Category"} is created</h3>;

    const showError = () =>
        error && <h3 className="text-danger">{typeof error === "string" ? error : "Category should be unique"}</h3>;

    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="back-link">
                Back to Dashboard
            </Link>
        </div>
    );

    return (
        <Layout title="Add a new category" description="">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Layout>
    );
};

export default AddCategory;
