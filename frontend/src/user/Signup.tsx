import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { signup } from "../auth";
import type { SignupFormState } from "../types";
import { useTranslation } from "react-i18next";

const Signup: React.FC = () => {
    const [values, setValues] = useState<SignupFormState>({
        name: "",
        email: "",
        password: "",
        error: "",
        success: false,
    });
    const { t } = useTranslation();

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
            <div>
                <label>{t("name")}</label>
                <input
                    onChange={handleChange("name")}
                    type="text"
                    value={name}
                    required
                />
            </div>

            <div className="form-group">
                <label className="text-muted">{t("email")}</label>
                <input
                    onChange={handleChange("email")}
                    type="email"
                    value={email}
                    required
                />
            </div>

            <div>
                <label>{t("password")}</label>
                <input
                    onChange={handleChange("password")}
                    type="password"
                    value={password}
                    required
                />
            </div>

            <button type="submit">
                {t("signup")}
            </button>
        </form>
    );

    const showError = () =>
        error ? (
            <div>
                {error}
            </div>
        ) : null;

    const showSuccess = () =>
        success ? (
            <div>
                New account created successfully. Please <Link to="/signin">Signin</Link>.
            </div>
        ) : null;

    return (
        <Layout
            title={t("signup")}
            description=""
        >
            {showSuccess()}
            {showError()}
            {signUpForm()}
        </Layout>
    );
};

export default Signup;