import { useTranslation } from "react-i18next";
import {
  FormControl,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";

type Lang = "en" | "fr" | "de" | "es" | "it";

export default function LangToggle() {
  const { i18n } = useTranslation();

  const currentLang: Lang =
    i18n.language.startsWith("fr")
      ? "fr"
      : i18n.language.startsWith("de")
      ? "de"
      : i18n.language.startsWith("es")
      ? "es"
      : i18n.language.startsWith("it")
      ? "it"
      : "en";

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value as Lang);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 80 }}>
      <Select
        value={currentLang}
        onChange={handleChange}
        displayEmpty
        sx={{
          borderRadius: 0,
          fontWeight: 600,
        }}
      >
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="de">DE</MenuItem>
        <MenuItem value="es">ES</MenuItem>
        <MenuItem value="it">IT</MenuItem>
        <MenuItem value="fr">FR</MenuItem>
      </Select>
    </FormControl>
  );
}
