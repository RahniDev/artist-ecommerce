import { Link } from "react-router-dom";
import ProductImage from "./ShowImage";
import type { CardProps } from "../types";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import SoldBadge from "./SoldBadge";

const ProductCard: React.FC<CardProps> = ({
    product,
    textColor
}) => {

    return (
        <Card elevation={0}
            sx={{
                boxShadow: "none",
                border: "none",
                backgroundColor: "transparent"
            }}>
            <Box
                sx={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box component={Link}
                    to={`/product/${product._id}`}>
                    <ProductImage
                        item={product}
                        url="product"
                        sizes="(max-width: 600px) 100vw, 33vw"
                        width="100%"
                        showAll={false}
                    />
                    {/*
The paintings themselves remain discoverable only through their collections.
Archive = a page showing everything

Put comma in the price.

View work on the collection page:
with a very subtle underline appearing only on hover.

Title:

Instrument Serif
18–22px
Medium weight

View details:
Slightly lighter colour
The title should naturally draw the eye first.      */}
                </Box>
                <CardContent sx={{
                    width: "100%",
                    px: 0,
                    pt: 1,
                    pb: 0
                }}>
                    <Stack spacing={1}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography
                                variant="h2"
                                fontSize="19px"
                                color={textColor}>
                                {product.nameEn}
                            </Typography>
                            {/* Directs to product page, not cart */}
                            <Link to={`/product/${product._id}`} style={{ fontSize: "14px", marginTop: 1, color: textColor, marginRight: "0rem" }}>View work →</Link>
                        </Box>
                        <Box component={Link} to={`/products/${product._id}`}>
                            {product.nameEn !== product.name && (
                                <Typography variant="body1"
                                    fontStyle="italic">
                                    {product.name}
                                </Typography>
                            )}
                        </Box>

                        <SoldBadge quantity={product.quantity} />
                    </Stack>
                </CardContent>
            </Box>
        </Card>
    );
};

export default ProductCard;