
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { LayoutProps } from '../types'

const Layout: React.FC<LayoutProps> = ({
    title = "Title",
    description = "Description",
    className = "",
    children,
}) => {
    return (
        <div>
            <Navbar />
            <div className="jumbotron">
                <h2>{title}</h2>
                <p className="lead">{description}</p>
            </div>
            <div className={className}>{children}</div>
            <Footer />
        </div>
    );
};

export default Layout;