import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import Layout from "../core/Layout";
import { signup } from "../auth";
import type { SignupFormState } from "../types";
import { useTranslation } from "react-i18next";
import AuthCard from "./AuthCard";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Link,
} from "@mui/material";

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
            const data = await signup({ name, email, password });

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
            setValues({
                ...values,
                error: exc?.message ?? "Signup failed",
                success: false,
            });
        }
    };

   const signUpForm = () => (
    <AuthCard title={t("signup")}>
        {success && (
            <Alert severity="success">
                {t("account_created")}{" "}
                <Link component={RouterLink} to="/signin">
                    {t("signin")}
                </Link>
            </Alert>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
            label={t("name")}
            value={name}
            onChange={handleChange("name")}
            fullWidth
            required
        />

        <TextField
            label={t("email")}
            type="email"
            value={email}
            onChange={handleChange("email")}
            fullWidth
            required
        />

        <TextField
            label={t("password")}
            type="password"
            value={password}
            onChange={handleChange("password")}
            fullWidth
            required
        />

        <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            onClick={clickSubmit}
        >
            {t("signup")}
        </Button>

        <Typography variant="body2" textAlign="center">
            {t("already_have_account")}{" "}
            <Link component={RouterLink} to="/signin">
                {t("signin")}
            </Link>
        </Typography>
    </AuthCard>
);


    return (
        <Layout title={t("signup")} description="">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                px={2}
            >
                {signUpForm()}
            </Box>
        </Layout>
    );
};

export default Signup;