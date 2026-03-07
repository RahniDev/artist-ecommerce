import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Grid, Typography, Link, Divider, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import { getCategories } from "./apiCore";
import type { Category } from "../types";
import Newsletter from "../user/Newsletter";

const Footer: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => { loadCategories(); }, []);

    const loadCategories = async () => {
        const res = await getCategories();
        if (res.error) console.error(res.error);
        else setCategories(res.data ?? []);
    };

    const topLevel = categories.filter(c => !c.parent);

    return (
        <Box component="footer" sx={{ bgcolor: "#f5f5f5", mt: 4, p: 4 }}>
            <Grid container spacing={4} alignItems="flex-start">

                {/* Newsletter */}
                <Grid size={{xs: 12, md: 6}}>
                    <Newsletter />
                </Grid>

                {/* Shop */}
                <Grid size={{xs: 4, md: 2}}>
                    <Typography variant="h6" gutterBottom>Shop</Typography>
                    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                        {topLevel.map(c => (
                            <li key={c._id}>
                                <Link component={RouterLink} to={`/category/${c._id}`} underline="hover" color="textPrimary">
                                    {c.name}
                                </Link>
                            </li>
                        ))}
                    </Box>
                </Grid>

                {/* Help */}
                <Grid size={{ xs: 4, md: 2 }}>
                    <Typography variant="h6" gutterBottom>Help</Typography>
                    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                        <li><Link component={RouterLink} to="/contact" underline="hover">Contact</Link></li>
                        <li><Link component={RouterLink} to="/shipping-returns" underline="hover">Shipping & Returns</Link></li>
                        <li><Link component={RouterLink} to="/privacy-policy" underline="hover">Privacy Policy</Link></li>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>T.&nbsp;</strong>+33 1 23 45 67 89
                    </Typography>
                </Grid>

                {/* Social */}
                <Grid size={{ xs: 4, md: 2 }}>
                    <IconButton component="a" href="https://instagram.com/sakari.artist" target="_blank" rel="noopener noreferrer" color="primary">
                        <InstagramIcon />
                    </IconButton>
                    <IconButton component="a" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" color="primary">
                        <LinkedInIcon />
                    </IconButton>
                    <IconButton component="a" href="https://facebook.com" target="_blank" rel="noopener noreferrer" color="primary">
                        <FacebookIcon />
                    </IconButton>
                </Grid>

            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" color="textSecondary" align="center">
                &copy; {new Date().getFullYear()} . All rights reserved.
            </Typography>
        </Box>
    );
};


export default Footer;