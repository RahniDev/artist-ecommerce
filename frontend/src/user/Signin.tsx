import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Layout from "../core/Layout";
import { useNavigate } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth";
import type { IUser, SigninState } from "../types";

const Signin: React.FC = () => {
    const navigate = useNavigate();

    const [values, setValues] = useState<SigninState>({
        email: "email@gmail.com",
        password: "password",
        error: "",
        loading: false,
        redirectToReferrer: false,
    });

    const { email, password, loading, error, redirectToReferrer } = values;

    const auth = isAuthenticated();
    const user: IUser | null = auth ? auth.user : null;

    const handleChange =
        (name: keyof SigninState) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                setValues({ ...values, error: "", [name]: event.target.value });
            };

    const clickSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setValues({ ...values, error: "", loading: true });

        try {
            const data = await signin({ email, password });

            if ("error" in data) {
                setValues({ ...values, error: data.error, loading: false });
            } else {
                authenticate(data, () => {
                    setValues({ ...values, redirectToReferrer: true });
                });
            }
        } catch (exc: any) {
            setValues({
                ...values,
                error: exc?.message ?? "Signin error",
                loading: false,
            });
        }
    };

    useEffect(() => {
        if (redirectToReferrer && user) {
            if (user.role === 1) {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        }

        // If already logged in
        if (isAuthenticated()) {
            navigate("/");
        }
    }, [redirectToReferrer, user, navigate]);

    const signInForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>

            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    const showError = () =>
        error ? <div className="alert alert-danger">{error}</div> : null;

    const showLoading = () =>
        loading ? (
            <div className="alert alert-info">
                <h2>Loading...</h2>
            </div>
        ) : null;

    return (
        <Layout
            title="Signin"
            description="Signin to our eco-friendly e-commerce shop."
            className="container col-md-8 offset-md-2">
            {showLoading()}
            {showError()}
            {signInForm()}
        </Layout>
    );
};

export default Signin;