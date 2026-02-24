import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Layout from "../core/Layout";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth";
import type { IUser, SigninState } from "../types";
import { useTranslation } from "react-i18next";
import Loader from "../core/Loader";
import { Box, TextField, Button, Alert, Link, Typography } from "@mui/material";
import AuthCard from "./AuthCard";

const Signin: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [values, setValues] = useState<SigninState>({
        email: "",
        password: "",
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

    const handleSubmit = async (event: FormEvent) => {
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
        if (!redirectToReferrer) return;

        if (user?.role === 1) {
            navigate("/admin/dashboard");
        } else {
            navigate("/user/dashboard");
        }
    }, [redirectToReferrer, user, navigate]);

// Checks if user is already logged in
    useEffect(() => {
        if (isAuthenticated())
            navigate("/");
    }, [navigate]);

    return (
        <Layout title={t("signin")} description="">
            <Loader loading={loading} />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="46vh"
                px={2}
            >
                <form onSubmit={handleSubmit}>
                    <AuthCard title="">
                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                            label={t("email")}
                            type="email"
                            value={email}
                            onChange={handleChange("email")}
                            fullWidth
                        />

                        <TextField
                            label={t("password")}
                            type="password"
                            value={password}
                            onChange={handleChange("password")}
                            fullWidth
                        />
                        <Box textAlign="right">
                            <Link component={RouterLink} to="/forgot-password">
                                {t("forgot_password")}
                            </Link>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            type="submit"
                        >
                            {t("signin")}
                        </Button>

                        <Typography variant="body2" textAlign="center">
                            {t("no_account")}{" "}
                            <Link component={RouterLink} to="/signup">
                                {t("signup")}
                            </Link>
                        </Typography>
                    </AuthCard>
                </form>
            </Box>
        </Layout>
    );
};

export default Signin;