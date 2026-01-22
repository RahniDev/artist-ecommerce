import Badge from "@mui/material/Badge";
import type { SoldBadgeProps } from "../types";

const SoldBadge: React.FC<SoldBadgeProps> = ({ quantity }) => {
    return quantity === 0 && (
        <Badge color="error" badgeContent="Sold" />
    );
};

export default SoldBadge;
