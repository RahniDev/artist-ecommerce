import { useTranslation } from "react-i18next";
import profileImg from '../assets/profile.webp';
import { Box, Typography, Avatar } from "@mui/material";
import Layout from "./Layout";

const About = () => {
  const { t } = useTranslation();

  return (
    <Layout title="" description="">
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "center", md: "flex-start" },
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
          textAlign: { xs: "center", md: "left" },
          py: 6,
          color: "#555",
        }}
      >
        <Box sx={{ display: "flex", width: "30%", justifyContent: { xs: "center", md: "flex-start" } }}>
          <Avatar
            src={profileImg}
            alt="Artist Portrait"
            sx={{
              width: 230,
              height: 230,
            }}
          />
        </Box>

        <Box sx={{ width: "60%", mx: "auto" }}>
          <Typography sx={{fontSize: {xs: '38px', md: '50px'}}} variant="h1" component="h1" gutterBottom>
            {t("about_title")}
          </Typography>

          <Typography textAlign="center"
            variant="h2" component="h2" padding='40px' fontSize='32px' gutterBottom>
            Sakari De-Meis
          </Typography>

          <Typography variant="body1">
            {t("about_text")}
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}

export default About;