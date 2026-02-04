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
        <Card sx={{ width: 240, textAlign: "center", position: "relative" }}>
            <CardActionArea component={Link} to={`/product/${product._id}`}>
                <ShowImage item={product} url="product" width={240} height={240} />

                <CardContent>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1" component="div" fontWeight={600}>
                            {product.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            € {product.price}
                        </Typography>

                        <SoldBadge quantity={product.quantity} />

                        {product.quantity > 0 && (
                            <Box sx={{ mt: 1 }}>
                                <AddToCartButton product={product} />
                            </Box>
                        )}
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ProductCard;
