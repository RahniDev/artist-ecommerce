import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { signup } from "../auth";
import type { SignupFormState } from "../types";

const Signup: React.FC = () => {
    const [values, setValues] = useState<SignupFormState>({
        name: "",
        email: "",
        password: "",
        error: "",
        success: false,
    });

    const { name, email, password, success, error } = values;

    const handleChange =
        (field: keyof SignupFormState) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                setValues({ ...values, error: "", [field]: event.target.value });
            };

    const clickSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setValues({ ...values, error: "" });

        try {
            const data = await signup({
                name,
                email,
                password,
            });

            if ("error" in data) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({
                    name: "",
                    email: "",
                    password: "",
                    error: "",
                    success: true,
                });
            }
        } catch (exc: any) {
            console.error("Signup error:", exc);
            setValues({ ...values, error: exc.message ?? "Signup failed", success: false });
        }
    };

    const signUpForm = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={handleChange("name")}
                    type="text"
                    className="form-control"
                    value={name}
                    required
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                    required
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                    required
                />
            </div>

            <button type="submit" className="btn btn-color btn-primary">
                Submit
            </button>
        </form>
    );

    const showError = () =>
        error ? (
            <div className="alert alert-danger">
                {error}
            </div>
        ) : null;

    const showSuccess = () =>
        success ? (
            <div className="alert alert-info">
                New account created successfully. Please <Link to="/signin">Signin</Link>.
            </div>
        ) : null;

    return (
        <Layout
            title="Signup"
            description="Signup to our eco-friendly e-commerce shop."
            className="container col-md-8 offset-md-2"
        >
            {showSuccess()}
            {showError()}
            {signUpForm()}
        </Layout>
    );
};

export default Signup;