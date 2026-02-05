import { Link } from "react-router-dom";
import ShowImage from "./ShowImage";
import type { CardProps } from "../types";
import { Card, CardActionArea, CardContent, Typography, Box, Stack } from "@mui/material";
import SoldBadge from "./SoldBadge";
import AddToCartButton from "./AddToCartButton";

const ProductCard: React.FC<CardProps> = ({
    product
}) => {

    return (
        <Card sx={{ width: 240, position: "relative" }}>
            <CardActionArea
                component={Link}
                to={`/product/${product._id}`}
                sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <ShowImage
                    item={product}
                    url="product"
                    width={240}
                    height={240}
                />

                <CardContent sx={{ width: "100%" }}>
                    <Stack spacing={1} alignItems="center">
                        <Typography
                            variant="subtitle1"
                            component="div"
                            fontWeight={600}
                            textAlign="center"
                        >
                            {product.name}
                        </Typography>

                        <SoldBadge quantity={product.quantity} />

                        {product.quantity > 0 && (
                            <>
                                <Typography variant="body2" color="text.secondary">
                                    € {product.price}
                                </Typography>

                                <Box sx={{ mt: 1 }}>
                                    <AddToCartButton product={product} />
                                </Box>
                            </>
                        )}
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ProductCard;
