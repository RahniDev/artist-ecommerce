import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    Alert,
    Stack,
} from "@mui/material";
import Layout from "../core/Layout";
import { API } from "../config";

const ResetPassword: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!password || !confirmPassword) {
            setError("Please fill in both fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API}/resetPassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (data === "password updated") {
                setSuccess(true);
                setTimeout(() => navigate("/signin"), 3000);
            } else {
                setError(data.error || "Something went wrong. Your link may have expired.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Reset Password" description="Set a new password">
            <Box maxWidth={400} mx="auto" mt={4}>
                {success ? (
                    <Alert severity="success">
                        Password updated! Redirecting to sign in...
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="New password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Confirm new password"
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                fullWidth
                                required
                            />
                            {error && <Alert severity="error">{error}</Alert>}
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Reset password"}
                            </Button>
                        </Stack>
                    </form>
                )}
            </Box>
        </Layout>
    );
};

export default ResetPassword;
