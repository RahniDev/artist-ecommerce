import Badge from "@mui/material/Badge";

interface StockBadgeProps {
    quantity: number;
}

const StockBadge: React.FC<StockBadgeProps> = ({ quantity }) => {
    return quantity > 0 ? (
        <Badge color="primary" badgeContent="In Stock" />
    ) : (
        <Badge color="error" badgeContent="Out of Stock" />
    );
};

export default StockBadge;
