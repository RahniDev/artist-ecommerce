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
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Signup: React.FC = () => {
    const [values, setValues] = useState<SignupFormState>({
        name: "",
        email: "",
        password: "",
        error: "",
        success: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const { t } = useTranslation();
    const { name, email, password, success, error } = values;

    const handleChange =
        (field: keyof SignupFormState) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                setValues({ ...values, error: "", [field]: event.target.value });
            };

    const handleSubmit = async (event: FormEvent) => {
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

    return (
        <Layout title={t("signup")} description="">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                px={2}
            >
                <form onSubmit={handleSubmit}>
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
                        />

                        <TextField
                            label={t("email")}
                            type="email"
                            value={email}
                            onChange={handleChange("email")}
                            fullWidth
                        />

                        <TextField
                            label={t("password")}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handleChange("password")}
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                        <Box textAlign="right">
                            <Link component={RouterLink} to="/forgot-password">
                                {t("forgot_password")}
                            </Link>
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                        >
                            {t("signup")}
                        </Button>

                        <Typography variant="body2" textAlign="center">
                            {t("existing_account")}{" "}
                            <Link component={RouterLink} to="/signin">
                                {t("signin")}
                            </Link>
                        </Typography>
                    </AuthCard>
                </form>
            </Box>
        </Layout>
    );
};

export default Signup;