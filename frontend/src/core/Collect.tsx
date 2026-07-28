import { Typography, Box } from "@mui/material"

const Collect = () => {
    return (
        <Box sx={{ p: 2 }}><Typography variant="h1">Collect</Typography>
            <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                Acquiring an original work</Typography>
            {/* A short introduction.*/}
            <Typography variant="subtitle2">
                Availability</Typography>
            <Typography variant="subtitle2">
                Reserving a painting </Typography>
            <Typography variant="subtitle2">
                Shipping </Typography>
            <Typography variant="subtitle2">
                Framing</Typography>
            <Typography variant="subtitle2">
                Certificates of authenticity</Typography>
            <Typography variant="subtitle2">
                International collectors</Typography>
            <Typography variant="subtitle2">
                Contact</Typography>
        </Box>
    )
}

export default Collect