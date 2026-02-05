import Badge from "@mui/material/Badge";
import type { SoldBadgeProps } from "../types";
import { useTranslation } from "react-i18next";

const SoldBadge: React.FC<SoldBadgeProps> = ({ quantity }) => {
    const { t } = useTranslation();
    return quantity === 0 && (
        <Badge color="error" badgeContent={t("sold")} />
    );
};

export default SoldBadge;
