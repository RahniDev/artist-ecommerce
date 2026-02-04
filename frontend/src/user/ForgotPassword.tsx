import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Alert,
    Stack,
} from "@mui/material";
import Layout from "../core/Layout";
import { Link } from "react-router-dom";


const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [showError, setShowError] = useState(false);
    const [messageFromServer, setMessageFromServer] = useState("");
    const [showNullError, setShowNullError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            setShowNullError(true);
            setShowError(false);
            setMessageFromServer("");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/forgotPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data === "recovery email sent") {
                setMessageFromServer("recovery email sent");
                setShowError(false);
                setShowNullError(false);
            } else if (data === "email not in db") {
                setShowError(true);
                setMessageFromServer("");
                setShowNullError(false);
            } else {
                setShowError(true);
                setMessageFromServer("");
                setShowNullError(false);
            }
        } catch (err) {
            console.error(err);
            setShowError(true);
            setMessageFromServer("");
            setShowNullError(false);
        }
    };

    return (
        <Layout
            title="Forgot Password"
            description="Reset your password"
        >
            <Box
                maxWidth={400}
                mx="auto"
                mt={4}
            >
                <form onSubmit={sendEmail}>
                    <Stack spacing={2}>
                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Email address"
                            fullWidth
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                        >
                            Send password reset email
                        </Button>
                    </Stack>
                </form>

                <Stack spacing={2} mt={3}>
                    {showNullError && (
                        <Alert severity="warning">
                            The email address cannot be empty.
                        </Alert>
                    )}

                    {showError && (
                        <Alert severity="error">
                            That email address isn&apos;t recognized. Please try again or register
                            for a new account.
                        </Alert>
                    )}

                    {messageFromServer === "recovery email sent" && (
                        <Alert severity="success">
                            Password reset email successfully sent!
                        </Alert>
                    )}
                </Stack>

                <Box mt={3} textAlign="center">
                    <Button
                        component={Link}
                        to="/"
                        variant="text"
                    >
                        Go Home
                    </Button>
                </Box>
            </Box>
        </Layout>
    );
};

export default ForgotPassword;
