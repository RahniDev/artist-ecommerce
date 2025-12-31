import Badge from "@mui/material/Badge";
import type { StockBadgeProps } from "../types";

const StockBadge: React.FC<StockBadgeProps> = ({ quantity }) => {
    return quantity > 0 ? (
        <Badge color="primary" badgeContent="In Stock" />
    ) : (
        <Badge color="error" badgeContent="Out of Stock" />
    );
};

export default StockBadge;
