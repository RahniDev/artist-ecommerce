import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hero from '../assets/hero.webp'
import { Box, Typography } from '@mui/material'
import { Analytics } from "@vercel/analytics/react"

const EntrancePage = () => {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    const handleEnter = () => {
        setFadeOut(true);

        setTimeout(() => {
            navigate("/collections");
        }, 900);
    };

    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                height: "100vh",
                opacity: fadeOut ? 0 : 1,
                transition: "opacity 900ms ease-in-out",
                bgcolor: "rgb(250,250,250)",
            }}>
                <Analytics />
                <Box
                    component="img"
                    src={hero}
                    alt="Hero"
                    sx={{
                        width: {
                            xs: "88vw",
                            sm: "78vw",
                            md: "68vw",
                            lg: "60vw",
                        },
                        maxWidth: "1060px",
                        maxHeight: "68vh",
                        height: "auto",
                    }}
                />
                <Typography
                    sx={{
                        mt: 3,
                        mb: 1,
                        fontFamily: "Instrument Serif, serif",
                        fontSize: {
                            xs: "2rem",
                            md: "2.3rem",
                        },
                        lineHeight: 1,
                        letterSpacing: "0.08em",
                    }}
                >
                    SAKARI
                </Typography>
                <Typography
                    onClick={handleEnter}
                    sx={{
                        mt: 0.5,
                        cursor: "pointer",
                        textDecoration: "none",
                        opacity: 0.8,
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    Enter
                </Typography>
            </Box>
        </>
    )
}

export default EntrancePage