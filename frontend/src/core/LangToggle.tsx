import { useTranslation } from "react-i18next";

export default function LangToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith("fr") ? "fr" : i18n.language.startsWith("de") ? "de" : i18n.language.startsWith("es") ? "es" : i18n.language.startsWith("it") ? "it" : "en";

  const changeLang = (lang: "en" | "fr" | "de" | "es" | "it") => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="lang-toggle">
      <button
        className={`lang-option ${currentLang === "en" ? "active" : ""}`}
        onClick={() => changeLang("en")}
        aria-pressed={currentLang === "en"}
      >
        EN
      </button>
            <span className="lang-separator">/</span>

      <button
        className={`lang-option ${currentLang === "de" ? "active" : ""}`}
        onClick={() => changeLang("de")}
        aria-pressed={currentLang === "de"}
      >
        DE
      </button>
            <span className="lang-separator">/</span>

      <button
        className={`lang-option ${currentLang === "es" ? "active" : ""}`}
        onClick={() => changeLang("es")}
        aria-pressed={currentLang === "es"}
      >
        ES
      </button>
            <span className="lang-separator">/</span>

      <button
        className={`lang-option ${currentLang === "it" ? "active" : ""}`}
        onClick={() => changeLang("it")}
        aria-pressed={currentLang === "it"}
      >
        IT
      </button>

      <span className="lang-separator">/</span>

      <button
        className={`lang-option ${currentLang === "fr" ? "active" : ""}`}
        onClick={() => changeLang("fr")}
        aria-pressed={currentLang === "fr"}
      >
        FR
      </button>
    </div>
  );
}