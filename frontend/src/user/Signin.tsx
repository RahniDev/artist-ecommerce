import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Layout from "../core/Layout";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth";
import type { SigninState } from "../types";
import { useTranslation } from "react-i18next";
import Loader from "../core/Loader";
import { Box, TextField, Button, Alert, Link, Typography } from "@mui/material";
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
        error: "",
        loading: false,
        redirectToReferrer: false,
    });

    const { email, password, loading, error } = values;
    const auth = isAuthenticated();

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
            setValues({ ...values, error: exc?.message ?? "Signin error", loading: false });
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