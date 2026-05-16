import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("privacy_policy_header")}</h1>
      <p>{t("privacy_policy_intro")}</p>
       <p>{t("privacy_policy_info")}</p>
      <p>{t("privacy_policy_payment")}</p>
      <p>{t("privacy_policy_use")}</p>
      <p>{t("privacy_policy_sharing")}</p>
      <p>{t("privacy_policy_newsletter")}</p>
      <p>{t("privacy_policy_data")}</p>
      <p>{t("privacy_policy_rights")}</p>
      <p>{t("privacy_policy_cookies")}</p>
      <p>{t("privacy_policy_security")}</p>
    </>
  )
}

export default PrivacyPolicy
