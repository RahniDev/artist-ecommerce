import { Link } from "react-router-dom";
import ProductImage from "./ShowImage";
import type { CardProps } from "../types";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import SoldBadge from "./SoldBadge";
import { useLocalizedDescription } from "../hooks/useLocalizedDescription";

const ProductCard: React.FC<CardProps> = ({
    product,
    textColor,
    secondaryColor
}) => {

    const { description } = useLocalizedDescription(product);

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
                                variant="subtitle1"
                                component="div"
                                color={textColor}>
                                {product.nameEn}
                            </Typography>
                             {/* Directs to product page, not cart */}
                            <Link to={`/product/${product._id}`} style={{ marginTop: 1, color: textColor, marginRight: "2rem" }}>Collect</Link>
                        </Box>
                        <Box component={Link} to={`/products/${product._id}`}>
                            {product.nameEn !== product.name && (
                                <Typography variant="body1"
                                    fontStyle="italic">
                                    {product.name}
                                </Typography>
                            )}
                        </Box>
                        {product.quantity !== 0 && (
                            <Typography sx={{ whiteSpace: "pre-wrap" }} color={secondaryColor}> {description}</Typography>
                        )}
                        <SoldBadge quantity={product.quantity} />
                    </Stack>
                </CardContent>
            </Box>
        </Card>
    );
};

export default ProductCard;

