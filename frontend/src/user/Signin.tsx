import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Layout from "../core/Layout";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth";
import type { SigninState } from "../types";
import { useTranslation } from "react-i18next";
import Loader from "../core/Loader";
import { Box, TextField, Alert, Button, Link, Typography } from "@mui/material";
import AuthCard from "./AuthCard";
import { setAuth } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Signin: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState<SigninState>({
        email: "",
        password: "",
        loading: false,
        redirectToReferrer: false,
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        general: ""
    });

    const { email, password, loading } = values;
    const auth = isAuthenticated();

    const handleChange =
        (name: keyof SigninState) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                setValues({
                    ...values,
                    [name]: event.target.value
                });

                setErrors(prev => ({
                    ...prev,
                    [name]: "",
                    general: ""
                }));
            };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setErrors({
            email: "",
            password: "",
            general: ""
        });
        if (!email.trim()) {
            return setErrors({
                email: "Email is required.",
                password: "",
                general: ""
            });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return setErrors({
                email: "Please enter a valid email.",
                password: "",
                general: ""
            });
        }

        if (!password.trim()) {
            return setErrors({
                email: "",
                password: "Password is required.",
                general: ""
            });
        }

        setValues({ ...values, loading: true });

        try {
            const data = await signin({ email: email.trim(), password: password.trim() });

            if ("error" in data) {
                setValues({ ...values, loading: false });
                setErrors({ email: "", password: "", general: data.error })
            } else {
                // keep localStorage in sync
                authenticate(data, () => { });
                dispatch(setAuth(data));

                if (data.user?.role === 1) {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }
            }
        } catch (exc: any) {
            setValues({
                ...values,
                loading: false
            });

            setErrors({
                email: "",
                password: "",
                general: exc?.message ?? "Signin error"
            });
        }
    };

    useEffect(() => {
        if (auth) navigate("/");
    }, []);

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
                {errors.general && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.general}
                    </Alert>
                )}
                <form onSubmit={handleSubmit} noValidate>
                    <AuthCard title="">
                        <TextField
                            label={t("email")}
                            type="email"
                            value={email}
                            onChange={handleChange("email")}
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email}
                        />

                        <TextField
                            label={t("password")}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handleChange("password")}
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password}
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
                            variant="contained"
                            size="large"
                            fullWidth
                            type="submit"
                            disabled={loading}
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