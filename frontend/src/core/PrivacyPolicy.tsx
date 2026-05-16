import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Layout from "./Layout";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <Layout>
    <Box sx={{ maxWidth: "76%", mx: "auto" }}>
      <Typography variant="h1" sx={{pb: 4}}>{t("privacy_policy_header")}</Typography>
      <Typography variant="body1">{t("privacy_policy_intro")}</Typography>
      <Typography variant="body1">{t("privacy_policy_info")}</Typography>
      <Typography variant="body1">{t("privacy_policy_payment")}</Typography>
      <Typography variant="body1">{t("privacy_policy_use")}</Typography>
      <Typography variant="body1">{t("privacy_policy_sharing")}</Typography>
      <Typography variant="body1">{t("privacy_policy_newsletter")}</Typography>
      <Typography variant="body1">{t("privacy_policy_data")}</Typography>
      <Typography variant="body1">{t("privacy_policy_rights")}</Typography>
      <Typography variant="body1">{t("privacy_policy_cookies")}</Typography>
      <Typography variant="body1">{t("privacy_policy_security")}</Typography>
    </Box>
    </Layout>
  )
}

export default PrivacyPolicy
