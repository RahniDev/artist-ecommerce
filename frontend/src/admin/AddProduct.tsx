import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createProduct, getCategories } from "./apiAdmin";
import type { Category } from "../types";
import Loader from "../core/Loader";

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

interface Values {
    name: string;
    description: string;
    price: string;
    categories: Category[];
    category: string;
    shipping: string;
    quantity: string;
    photo: File | string;
    loading: boolean;
    error: string;
    createdProduct: string;
    formData: FormData | null;
}

const AddProduct: React.FC = () => {
    const [values, setValues] = useState<Values>({
        name: "",
        description: "",
        price: "",
        categories: [],
        category: "",
        shipping: "",
        quantity: "",
        photo: "",
        loading: false,
        error: "",
        createdProduct: "",
        formData: null,
    });

    const { user, token } = isAuthenticated() as AuthData;
    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        formData,
    } = values;

    const init = async () => {
        const data = await getCategories();
        if (data.error) {
            setValues(prev => ({ ...prev, error: data.error || "" }));
        } else {
            setValues(prev => ({ ...prev, categories: data.data || [], formData: new FormData() }));
        }
    };
    useEffect(() => {
        init();
    }, []);

    const handleChange =
        (field: keyof Values) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const value = field === "photo" && event.target instanceof HTMLInputElement && event.target.files
                ? event.target.files[0]
                : event.target.value;

            formData?.set(field, value as string | Blob);
            setValues((prev) => ({ ...prev, [field]: value }));
        };

    const clickSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formData) return;

        setValues((prev) => ({ ...prev, error: "", loading: true }));

        try {
            const data = await createProduct(user._id, token, formData);

            if (data.error) {
                setValues(prev => ({ ...prev, error: data.error || "", loading: false }));
            } else if (data.data) {
                setValues(prev => ({
                    ...prev,
                    name: "",
                    description: "",
                    price: "",
                    quantity: "",
                    photo: "",
                    loading: false,
                    createdProduct: data.data.name,
                    formData: new FormData(),
                }));
            }
        } catch (err) {
            console.error(err);
            setValues((prev) => ({ ...prev, error: "Product creation failed", loading: false }));
        }
    };

    const newPostForm = () => (
        <form onSubmit={clickSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange("photo")}
                    />
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={handleChange("name")}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Product Description</label>
                <textarea
                    className="form-control"
                    value={description}
                    onChange={handleChange("description")}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={handleChange("price")}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select
                    className="form-control"
                    value={category}
                    onChange={handleChange("category")}
                >
                    <option>Please select</option>
                    {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select
                    className="form-control"
                    value={shipping}
                    onChange={handleChange("shipping")}
                >
                    <option>Please select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={handleChange("quantity")}
                />
            </div>

            <button className="btn btn-dashboard btn-outline-primary">Create Product</button>
        </form>
    );

    const showError = () =>
        error && <div className="alert alert-danger">{error}</div>;

    const showSuccess = () =>
        createdProduct && (
            <div className="alert alert-info">
                <h2>{`${createdProduct} is created!`}</h2>
            </div>
        );

    return (
        <Layout
            title="Add a new product"
            description={`Hello ${user.name}, ready to add a new product?`}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <Loader loading={loading} />
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    );
};

export default AddProduct;