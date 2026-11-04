import Badge from "@mui/material/Badge";
import type { SoldBadgeProps } from "../types";
import { useTranslation } from "react-i18next";

const SoldBadge: React.FC<SoldBadgeProps> = ({ quantity }) => {
    const { t } = useTranslation();
    return quantity === 0 ? (
        <Badge style={{marginRight: "2rem"}} color="error" badgeContent={t("sold")} />
    ) : (<Badge style={{marginRight: "2rem"}} color="success" badgeContent={t("available")} />)
};

export default SoldBadge;
