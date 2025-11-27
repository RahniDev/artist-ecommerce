import type { ReactNode } from "react";
import Navbar from "./Navbar";
import "../styles.css";

interface LayoutProps {
    title?: string;
    description?: string;
    className?: string;
    children: ReactNode;
}

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
        </div>
    );
};

export default Layout;