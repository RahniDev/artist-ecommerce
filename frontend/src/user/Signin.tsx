import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Layout from "../core/Layout";
import { useNavigate } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth";
import type { IUser, SigninState } from "../types";
import { useTranslation } from "react-i18next";
import Loader from "../core/Loader";
import { Box, TextField, Button, Typography, Alert, Stack, Paper } from "@mui/material";

const Signin: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

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

        if (isAuthenticated()) {
            navigate("/");
        }
    }, [redirectToReferrer, user, navigate]);

    const signInForm = () => (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
            <Stack spacing={2}>
                <Typography variant="h5" textAlign="center">{t("signin")}</Typography>

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

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={clickSubmit}
                    fullWidth
                    disabled={loading}
                >
                    {t("signin")}
                </Button>
            </Stack>
        </Paper>
    );

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
                {signInForm()}
            </Box>
        </Layout>
    );
};

export default Signin;
