import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
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
        <Layout title="Forgot Password Screen" description="Reset your password">
            <div>
                <form className="profile-form" onSubmit={sendEmail}>
                    <TextField
                        id="email"
                        label="Email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Email Address"
                    />
                    <Button
                        type="submit"
                        variant="contained">Send Forgot Password Email</Button>
                </form>

                {showNullError && (
                    <div>
                        <p>The email address cannot be null.</p>
                    </div>
                )}

                {showError && (
                    <div>
                        <p>
                            That email address isn&apos;t recognized. Please try again or
                            register for a new account.
                        </p>
                        {/* <Button
                        type="submit"
                        variant="contained"
                        link="/register"
                    /> */}
                    </div>
                )}

                {messageFromServer === "recovery email sent" && (
                    <div>
                        <h3>Password Reset Email Successfully Sent!</h3>
                    </div>
                )}

                <Link to="/">Go Home</Link>
            </div>
        </Layout>
    );
};

export default ForgotPassword;
