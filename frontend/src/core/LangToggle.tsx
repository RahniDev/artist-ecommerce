import { useTranslation } from "react-i18next";
import {
  FormControl,
  Select,
  Box,
  MenuItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import LanguageIcon from "@mui/icons-material/Language";
import type {
  SelectChangeEvent,
} from "@mui/material";
import { setLanguage } from "../redux/slices/languageSlice";

type Lang = "en" | "fr" | "de" | "es" | "it";

export default function LangToggle() {
  const { i18n } = useTranslation();
    const dispatch = useDispatch();

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
    const newLang = event.target.value as Lang;
    
    i18n.changeLanguage(newLang);
    
    dispatch(setLanguage(newLang));
  };
  return (
    <FormControl size="small" variant="standard">
      <Select
        value={currentLang}
        onChange={handleChange}
        disableUnderline
        IconComponent={() => null} // removes the arrow icon
        sx={{
          minWidth: 70,
          height: 32,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          transition: "color 0.2s ease",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            paddingRight: "0 !important",
            lineHeight: 1,
          },
        }}
        renderValue={(selected) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              lineHeight: 1,
            }}
          >
            <LanguageIcon
              sx={{
                fontSize: 20,
                display: "block",
              }}
            />
            <Box
              component="span"
              sx={{
                display: "block",
                lineHeight: "14px",
                fontSize: 14
              }}
            >
              {(selected as string).toUpperCase()}
            </Box>
          </Box>
        )}
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
