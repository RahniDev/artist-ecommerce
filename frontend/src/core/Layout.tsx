import Navbar from "./Navbar";
import Footer from "./Footer";
import type { LayoutProps } from '../types'

const Layout: React.FC<LayoutProps> = ({
  title = "",
  className = "",
  children,
  backgroundColor = "#FFFFFF",
  textColor = "#3a3535"
}: LayoutProps) => {
  return (
    <>
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
    </>
  );
};

export default Layout;