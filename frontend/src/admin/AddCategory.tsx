import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { AuthData } from "../types.ts";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createCategory } from "./apiAdmin.ts";
import {
    Box,
    Typography,
    Button
} from "@mui/material";

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
        <form id="categoryForm" onSubmit={clickSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label>Name</label>
                <input
                    type="text"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                />
                <Button>Create Category</Button>
            </Box>
        </form>
    );

    const showSuccess = () =>
        success && <h3>{name || "Category"} is created</h3>;

    const showError = () =>
        error && <h3>{typeof error === "string" ? error : "Category should be unique"}</h3>;

    const goBack = () => (
        <Link to="/admin/dashboard">
            Back to Dashboard
        </Link>
    );

    return (
        <Layout title="" description="">
            <Typography variant='h1'>Add a new category</Typography>
            <Box>
                {goBack()}
                {showSuccess()}
                {showError()}
                {newCategoryForm()}
            </Box>
        </Layout>
    );
};

export default AddCategory;
