import i18n from "i18next";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";

const LangSwitch = () => {
    const [lang, setLang] = useState(i18n.language || "en");

    const handleChange = (event: any) => {
        const newLang = event.target.value;
        setLang(newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
                <Select
                    labelId="lang-label"
                    value={lang}
                    label="Lang"
                    onChange={handleChange}
                >
                    <MenuItem value="en">EN</MenuItem>
                    <MenuItem value="fr">FR</MenuItem>
                    <MenuItem value="de">DE</MenuItem>
                    <MenuItem value="es">ES</MenuItem>
                    <MenuItem value="it">IT</MenuItem>

                </Select>
            </FormControl>
        </Box>
    );
};

export default LangSwitch;
