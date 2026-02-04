
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { LayoutProps } from '../types'
import { Box, Container, Typography } from "@mui/material";

const Layout: React.FC<LayoutProps> = ({
    title = "Title",
    description = "Description",
    className = "",
    children,
}) => {
    return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Navbar */}
      <Navbar />

      {/* Page header */}
      {(title || description) && (
        <Box
          sx={{
            py: 4,
            textAlign: "center",
            backgroundColor: "background.default",
          }}
        >
          {title && (
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
          )}

          {description && (
            <Typography variant="subtitle1" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
      )}

      {/* Main content */}
      <Container
        maxWidth="lg"
        sx={{ flexGrow: 1, py: 4 }}
        className={className}
      >
        {children}
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
    );
};

export default Layout;