import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Layout from "../core/Layout";
import { useNavigate } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth";
import type { IUser, SigninState } from "../types";
import { useTranslation } from "react-i18next";
import Loader from "../core/Loader";

const Signin: React.FC = () => {
    const navigate = useNavigate();

    const [values, setValues] = useState<SigninState>({
        email: "email@gmail.com",
        password: "password",
        error: "",
        loading: false,
        redirectToReferrer: false,
    });
    const { t } = useTranslation();
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
                <label className="text-muted">{t("email")}</label>
                <input
                    onChange={handleChange("email")}
                    type="email"
                    value={email}
                />
            </div>

            <div>
                <label>{t("password")}</label>
                <input
                    onChange={handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>

            <button onClick={clickSubmit}>
                {t("signin")}
            </button>
        </form>
    );

    const showError = () =>
        error ? <div>{error}</div> : null;


    return (
        <Layout
            title={t("signin")}
            description="">
            <Loader loading={loading} />
            {showError()}
            {signInForm()}
        </Layout>
    );
};

export default Signin;