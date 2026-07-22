import { Link } from "react-router-dom";
import hero from '../assets/hero.webp'
import { Box, Typography } from '@mui/material'

const EntrancePage = () => {
    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                height: "100vh"
            }}>
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
                        fontFamily: '"Instrument Serif", serif',
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
                    component={Link}
                    to="/collections"
                    sx={{
                        mt: 0.5,
                        p: 0,
                        border: 0,
                        background: "transparent",
                        color: "#1f1f1f",
                        cursor: "pointer",
                        fontFamily: '"Inter", sans-serif',
                        fontSize: "0.9rem",
                        fontWeight: 300,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.8,
                        textDecoration: "none",
                        transition: "opacity 200ms ease", "&:hover": {
                            textDecoration: "underline"
                        },
                    }}>Enter</Typography>
            </Box>
        </>
    )
}

export default EntrancePage