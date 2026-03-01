import { useTranslation } from "react-i18next";
import profileImg from '../assets/profile.webp';
import { Box, Typography, Avatar } from "@mui/material";

const About = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        flexDirection: { xs: "column", md: "row" },
        textAlign: { xs: "center", md: "left" },
        py: 6,
      }}
    >
      <Box sx={{ display: "flex", width: "30%", justifyContent: "center" }}>
        <Avatar
          src={profileImg}
          alt="Artist Portrait"
          sx={{
            width: 230,
            height: 230,
          }}
        />
      </Box>

      <Box sx={{ width: "50%", mx: "auto" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t("about_title")}
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          Sakari De-Meis
        </Typography>

        <Typography variant="body1">
          {t("about_text")}
        </Typography>
      </Box>
    </Box>
  );
}

export default About;