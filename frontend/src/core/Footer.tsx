import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Grid, Typography, Link, Divider, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import { getCategories } from "./apiCore";
import type { ICategory } from "../types";

const Footer: React.FC = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);

    const loadCategories = async () => {
        const res = await getCategories();
        if (res.error) {
            console.error(res.error);
        } else {
            setCategories(res.data ?? []);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <Box component="footer" sx={{ bgcolor: "#f5f5f5", mt: 4, p: 4 }}>
            <Grid container size={24} spacing={8} alignItems="flex-start">
                <Grid container>
                    <Grid size={6}>
                        <Typography variant="h6" gutterBottom>
                            Shop
                        </Typography>
                        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                            {categories.map((c) => (
                                <li key={c._id}>
                                    <Link
                                        component={RouterLink}
                                        to={`/shop/category/${c._id}`}
                                        underline="hover"
                                        color="textPrimary"
                                    >
                                        {c.name}
                                    </Link>
                                </li>
                            ))}
                        </Box>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="h6" gutterBottom>
                                Help
                            </Typography>
                            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                                <li>
                                    <Link component={RouterLink} to="/" underline="hover">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link component={RouterLink} to="/" underline="hover">
                                        Shipping & Returns
                                    </Link>
                                </li>
                            </Box>
                            <Box component="ul" sx={{ listStyle: "none", p: 0, mt: 1 }}>
                                <li>
                                    <Typography variant="body2">
                                        <strong>T.&nbsp;</strong>+33 1 23 45 67 89
                                    </Typography>
                                </li>
                            </Box>
                        </Grid>
                        
                    </Grid>
                    <Grid size={4}>
                    <IconButton
                        component="a"
                        href="https://instagram.com/sakari.artist"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                    >
                        <InstagramIcon />
                    </IconButton>
                    <IconButton
                        component="a"
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                    >
                        <LinkedInIcon />
                    </IconButton>
                     <IconButton
                        component="a"
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                    >
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