import Navbar from "./Navbar";
import Footer from "./Footer";
import type { LayoutProps } from '../types'
import { Box, Container, Typography } from "@mui/material";

const Layout: React.FC<LayoutProps> = ({
  title = "",
  className = "",
  children,
}) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      {/* Page header */}
      {(title) && (
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "background.default",
          }}
        >
          {title && (
            <Typography variant="h4" component="h1" gutterBottom mt={4}>
              {title}
            </Typography>
          )}
        </Box>
      )}
      {/* Main content */}
      <Container
        maxWidth="xl"
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