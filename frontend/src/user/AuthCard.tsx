import {
    Paper,
    Typography,
    Stack,
} from "@mui/material";
import type { AuthCardProps } from "../types";

const AuthCard: React.FC<AuthCardProps> = ({ title, children }) => {
    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
            <Stack spacing={2}>
                <Typography variant="h5" textAlign="center">
                    {title}
                </Typography>

                {children}
            </Stack>
        </Paper>
    );
};

export default AuthCard;
