import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("privacy_policy_header")}</h1>
      <p>{t("privacy_policy_intro")}</p>
    </>
  )
}

export default PrivacyPolicy
