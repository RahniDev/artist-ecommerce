import { Link } from "react-router-dom";
import ShowImage from "./ShowImage";
import type { CardProps } from "../types";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import SoldBadge from "./SoldBadge";
import { useLocalizedDescription } from "../hooks/useLocalizedDescription";

const ProductCard: React.FC<CardProps> = ({
    product
}) => {

    const { description: localizedDescription } = useLocalizedDescription(product);

    return (
        <Card elevation={0}
            sx={{
                width: "100%",
                boxShadow: "none",
                border: "none",
                backgroundColor: "transparent"
            }}>
            <Box
                component={Link}
                to={`/product/${product._id}`}
                sx={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block"
                }}
            >
                <ShowImage
                    item={product}
                    url="product"
                    width="400px"
                />

                <CardContent sx={{
                    width: "100%",
                    px: 0,
                    pt: 1,
                    pb: 0
                }}>
                    <Stack spacing={1} alignItems="left">
                        <Typography
                            variant="subtitle1"
                            component="div"
                            fontWeight={600}>
                            {product.name}
                        </Typography>
                        <Typography color="#6c757d">{localizedDescription}</Typography>
                        <SoldBadge quantity={product.quantity} />

                        {product.quantity > 0 && (
                            <>
                                <Typography fontWeight={700}>
                                    € {product.price}
                                </Typography>
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Box>
        </Card >
    );
};

export default ProductCard;
