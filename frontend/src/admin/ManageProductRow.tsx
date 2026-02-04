import type { ManageProductRowProps } from "../types";
import { Link as RouterLink } from "react-router-dom";
import {
    ListItem,
    ListItemText,
    Stack,
    Chip,
    Typography
} from "@mui/material";

const ManageProductRow: React.FC<ManageProductRowProps> = ({ product, onDelete }) => (
    <ListItem
        divider
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}
    >
        <ListItemText
            primary={
                <Typography fontWeight={600}>
                    {product.name}
                </Typography>}
        />
        <Stack direction="row" spacing={1}>
            <Chip
                label="Update"
                color="warning"
                size="small"
                component={RouterLink}
                to={`/admin/product/update/${product._id}`}
                clickable
            />

            <Chip
                label="Delete"
                color="error"
                size="small"
                onClick={() => onDelete(product._id)}
                clickable
            />
        </Stack>
    </ListItem>
);

export default ManageProductRow;