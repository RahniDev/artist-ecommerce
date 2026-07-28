import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { Box } from "@mui/material";
import { fetchCategories } from "../redux/slices/categorySlice";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { LayoutProps } from '../types'

const Layout: React.FC<LayoutProps> = ({
  children,
  backgroundColor = "#FFFFFF",
  textColor = "#3a3535"
}: LayoutProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // The loaded check prevents every component using fetchCategories 
  // from causing another request
  const loaded = useSelector(
    (state: RootState) => state.categories.loaded
  );

  const loading = useSelector(
    (state: RootState) => state.categories.loading
  );

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, loaded, loading]);
  return (
    <Box
      sx={{
        backgroundColor
      }}
    >
      <Navbar
        backgroundColor={backgroundColor}
        textColor={textColor}
      />

      <main
        style={{
          backgroundColor,
          color: textColor,
          minHeight: "100vh",
        }}
      >
        {children}
      </main>

      <Footer
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    </Box>
  );
};

export default Layout;