import hero from '../assets/hero.webp'
import { Box, Typography, Button } from '@mui/material'
import Navbar from './Navbar'

const EntrancePage = () => {
    return (
        <>
        <Navbar />
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
                    maxHeight: "75vh",
                    maxWidth: "80vw",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                }}
            />
            <Typography variant="h1">Sakari De-Meis</Typography>
            <Button sx={{ textTransform: "uppercase", color: "#000" }}>Enter</Button>
        </Box>
        </>
    )
}

export default EntrancePage