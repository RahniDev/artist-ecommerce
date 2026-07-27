import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { Category } from "../types";
import type { RootState, AppDispatch } from "../redux/store";
import { Box, Container, Typography, Divider, Card, CardActionArea } from "@mui/material";
import { fetchCategories } from "../redux/slices/categorySlice";
import Loader from "./Loader";

const Collections = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { items: categories, loaded, loading } = useSelector(
        (state: RootState) => state.categories
    );

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(fetchCategories());
        }
    }, [dispatch, loaded, loading]);

    const collectionsCategory = categories.find(
        (category) => category.name.trim().toLowerCase() === "collections"
    );

    const mainCategories = categories.filter(
        (category) => category.parentCategory == null
    );

    const handleMainCategoryClick = (category: Category) => {
        if (category.name.trim().toLowerCase() === "collections") {
            document
                .getElementById("individual-collections")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

            return;
        }

        navigate(`/collection/${category._id}`);
    };
    loaded && console.log(collectionsCategory)

    return (
        <Box
            component="main"
            sx={{
                minHeight: "100vh",
                bgcolor: "#f7f5f1",
                py: {
                    xs: 6,
                    md: 10,
                },
            }}
        >
            <Container maxWidth="xl">

                <Box
                    sx={{
                        textAlign: "center",
                        mb: {
                            xs: 6,
                            md: 10,
                        },
                    }}
                >
                    <Loader loading={loading} />
                    <Typography
                        component="h1"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: {
                                xs: "2.2rem",
                                sm: "2.8rem",
                                md: "3.5rem",
                            },
                            fontWeight: 400,
                            letterSpacing: "-0.02em",
                            lineHeight: 1,
                            color: "#282525",
                            mb: 2,
                        }}
                    >
                        Explore the Work
                    </Typography>

                    <Typography
                        sx={{
                            maxWidth: 600,
                            mx: "auto",
                            fontSize: {
                                xs: "0.95rem",
                                md: "1.05rem",
                            },
                            lineHeight: 1.8,
                            color: "text.secondary",
                        }}
                    >
                        Enter each body of work as a distinct gallery space.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(3, 1fr)",
                        },
                        gap: {
                            xs: 3,
                            md: 4,
                        },
                        mb: {
                            xs: 8,
                            md: 12,
                        },
                    }}
                >
                    {mainCategories.map((category) => (
                        <MainCategoryCard
                            key={category._id}
                            category={category}
                            onClick={() => handleMainCategoryClick(category)}
                        />
                    ))}
                </Box>

                {collectionsCategory?.subcategories &&
                    collectionsCategory.subcategories.length > 0 && (
                        <Box>
                            <Box id="individual-collections"
                                sx={{
                                    scrollMarginTop: 32,
                                }}
                            >
                                <Divider sx={{ flex: 1 }} />

                                <Typography
                                    component="h2"
                                    sx={{
                                        fontFamily: '"Cormorant Garamond", serif',
                                        fontSize: {
                                            xs: "1.5rem",
                                            md: "1.8rem",
                                        },
                                        fontWeight: 400,
                                        color: "#282525",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Individual Collections
                                </Typography>

                                <Divider sx={{ flex: 1 }} />
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "repeat(2, 1fr)",
                                        lg: "repeat(3, 1fr)",
                                    },
                                    gap: {
                                        xs: 2,
                                        md: 3,
                                    },
                                }}
                            >
                                {collectionsCategory.subcategories.map((subcategory) => (
                                    <SubcategoryCard
                                        key={subcategory._id}
                                        subcategory={subcategory}
                                        onClick={() =>
                                            navigate(`/collection/${subcategory._id}`)
                                        }
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
            </Container>
        </Box>
    );
};

type MainCategoryCardProps = {
    category: Category;
    onClick: () => void;
};

const MainCategoryCard = ({
    category,
    onClick,
}: MainCategoryCardProps) => {
    return (
        <Card
            elevation={0}
            sx={{
                bgcolor: "transparent",
                border: "1px solid",
                borderColor: "rgba(40, 37, 37, 0.18)",
                borderRadius: 0,
                transition: "transform 250ms ease, box-shadow 250ms ease",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 45px rgba(35, 30, 30, 0.08)",
                },
            }}
        >
            <CardActionArea
                onClick={onClick}
                sx={{
                    minHeight: {
                        xs: 220,
                        md: 340,
                    },
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    p: {
                        xs: 3,
                        md: 4,
                    },
                }}
            >
                <Box>
                    <Typography
                        component="h2"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: {
                                xs: "2rem",
                                md: "2.3rem",
                            },
                            fontWeight: 400,
                            lineHeight: 1,
                            color: "#282525",
                            mb: 1.5,
                        }}
                    >
                        {category.name}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.16em",
                            color: "text.secondary",
                        }}
                    >
                        {category.name.trim().toLowerCase() === "collections"
                            ? "View collections"
                            : "Enter gallery"}
                    </Typography>
                </Box>
            </CardActionArea>
        </Card>
    );
};

type SubcategoryCardProps = {
    subcategory: Category;
    onClick: () => void;
};

const SubcategoryCard = ({
    subcategory,
    onClick,
}: SubcategoryCardProps) => {
    return (
        <Card
            elevation={0}
            sx={{
                bgcolor: "#fff",
                borderRadius: 0,
                border: "1px solid",
                borderColor: "rgba(40, 37, 37, 0.12)",
            }}
        >
            <CardActionArea
                onClick={onClick}
                sx={{
                    minHeight: 150,
                    p: {
                        xs: 2.5,
                        md: 3,
                    },
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    transition: "background-color 200ms ease",
                    "&:hover": {
                        bgcolor: "rgba(40, 37, 37, 0.035)",
                    },
                }}
            >
                <Typography
                    component="h3"
                    sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: {
                            xs: "1.7rem",
                            md: "2rem",
                        },
                        fontWeight: 400,
                        color: "#282525",
                    }}
                >
                    {subcategory.name}
                </Typography>

                <Typography
                    component="span"
                    aria-hidden="true"
                    sx={{
                        fontSize: "1.3rem",
                        color: "text.secondary",
                    }}
                >
                    →
                </Typography>
            </CardActionArea>
        </Card>
    );
};

export default Collections;