import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InstagramIcon from '@mui/icons-material/Instagram';
import { getCategories } from "./apiCore";
import type { ICategory } from "../types";
import "../styles.css";

interface FooterData {
    categories: ICategory[];
    category?: string;
}

const Footer: React.FC = () => {
    const [data, setData] = useState<FooterData>({ categories: [], category: "" });

    const loadCategories = async () => {
        try {
            const categories = await getCategories();
            if ("error" in categories) {
                console.error(categories.error);
            } else {
                setData((prev) => ({ ...prev, categories }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const { categories } = data;

    return (
        <footer id="footer">
            <div className="hrow row">
                <div className="col-sm-5 follow">
                        <span className="twitter-icon">
                            <a href="" target="_blank" rel="noopener noreferrer">
                                <InstagramIcon />
                            </a>
                        </span>
                </div>
                <div className="col-sm-7">
                    <div className="links">
                        <div className="col">
                            <h5>Shop</h5>
                            <ul>
                                {categories.map((c) => (
                                    <li key={c._id}>
                                        <Link to={`/shop/category/${c._id}`} className="c-link">
                                            {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col">
                            <h5>Help</h5>
                            <ul>
                                <li>
                                    <Link to="/" className="link">Contact</Link>
                                </li>
                                <li>
                                    <Link to="/" className="link">Shipping & Returns</Link>
                                </li>
                            </ul>
                            <ul className="contact">
                                <li>
                                    <strong>T.&nbsp;</strong>+33 1 23 45 67 89
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="hr" />
            <small>&copy; {new Date().getFullYear()} . All rights reserved.</small>
        </footer>
    );
};

export default Footer;