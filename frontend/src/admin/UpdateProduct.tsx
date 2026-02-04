import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";
import type { ApiResponse, ICategory, IProduct } from "../types";
import Loader from "../core/Loader";

interface Values {
    name: string;
    description: string;
    price: string;
    categories: ICategory[];
    category: string;
    shipping: string;
    quantity: string;
    photo: File | null;
    loading: boolean;
    error: string;
    createdProduct: string;
    formData: FormData | null;
}

const UpdateProduct = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const auth = isAuthenticated();

    if (!auth) {
        return <Navigate to="/signin" replace />;
    }

    const { user } = auth;

    const [values, setValues] = useState<Values>({
        name: "",
        description: "",
        price: "",
        categories: [],
        category: "",
        shipping: "",
        quantity: "",
        photo: null,
        loading: false,
        error: "",
        createdProduct: "",
        formData: null,
    });

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

    useEffect(() => {
        if (!productId) return;
        initProduct(productId);
    }, [productId]);

    const initProduct = async (id: string) => {
        try {
            const res: ApiResponse<IProduct> = await getProduct(id);

            if (res.error || !res.data) {
                setValues((p) => ({
                    ...p,
                    error: res.error ?? "Failed to load product",
                }));
                return;
            }

            const product = res.data;

            setValues((p) => ({
                ...p,
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category._id,
                shipping: product.shipping ? "1" : "0",
                quantity: product.quantity.toString(),
                formData: new FormData(),
            }));

            loadCategories();
        } catch {
            setValues((p) => ({ ...p, error: "Failed to load product" }));
        }
    };

    const loadCategories = async () => {
        const res: ApiResponse<ICategory[]> = await getCategories();
        if (!res.error) {
            setValues((p) => ({ ...p, categories: res.data ?? [] }));
        }
    };

    const handleChange =
        (field: keyof Values) =>
            (
                e: ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >
            ) => {
                if (!formData) return;

                const value =
                    field === "photo" && e.target instanceof HTMLInputElement
                        ? e.target.files?.[0] ?? null
                        : e.target.value;

                if (value !== null) {
                    formData.set(field, value);
                }

                setValues((p) => ({ ...p, [field]: value }));
            };

    const clickSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!productId || !formData) return;

        setValues((p) => ({ ...p, loading: true, error: "" }));

        try {
            const res: ApiResponse<IProduct> = await updateProduct(
                productId,
                auth.user._id,
                auth.token,
                formData
            );

            if (res.error || !res.data) {
                setValues((p) => ({
                    ...p,
                    error: res.error ?? "Update failed",
                    loading: false,
                }));
                return;
            }

            setValues((prev) => ({
                ...prev,
                createdProduct: res.data?.name ?? "",
            }));


            navigate("/");
        } catch {
            setValues((p) => ({
                ...p,
                error: "Update failed",
                loading: false,
            }));
        }
    };


    return (
        <Layout
            title="Update product"
            description={`Hello ${user.name}, update your product`}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                   <Loader loading={loading} />
                    {error && <div className="alert alert-danger">{error}</div>}
                    {createdProduct && (
                        <div className="alert alert-success">
                            {createdProduct} updated successfully
                        </div>
                    )}

                    <form onSubmit={clickSubmit}>
                        <input type="file" accept="image/*" onChange={handleChange("photo")} />

                        <input
                            className="form-control mt-2"
                            value={name}
                            onChange={handleChange("name")}
                            placeholder="Name"
                        />

                        <textarea
                            className="form-control mt-2"
                            value={description}
                            onChange={handleChange("description")}
                            placeholder="Description"
                        />

                        <input
                            className="form-control mt-2"
                            type="number"
                            value={price}
                            onChange={handleChange("price")}
                        />

                        <select
                            className="form-control mt-2"
                            value={category}
                            onChange={handleChange("category")}
                        >
                            <option value="">Select category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="form-control mt-2"
                            value={shipping}
                            onChange={handleChange("shipping")}
                        >
                            <option value="">Shipping</option>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>

                        <input
                            className="form-control mt-2"
                            type="number"
                            value={quantity}
                            onChange={handleChange("quantity")}
                        />

                        <button className="btn btn-primary mt-3">
                            Update Product
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default UpdateProduct;