import { Link } from "react-router-dom";
import ShowImage from "./ShowImage";
import type { CardProps } from "../types";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import SoldBadge from "./SoldBadge";

const ProductCard: React.FC<CardProps> = ({
    product
}) => {

    return (
        <Card elevation={0}
            sx={{
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
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <ShowImage
                    item={product}
                    url="product"
                    width="300px"
                    showAll={false}
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
                            component="div">
                            {product.nameEn}
                        </Typography>
                        {product.nameEn !== product.name && (
                            <Typography variant="body1" color="text.primary" fontStyle="italic">
                                {product.name}
                            </Typography>)}
                        <Typography sx={{ whiteSpace: "pre-wrap" }} color="#6c757d">{product.description}</Typography>
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
