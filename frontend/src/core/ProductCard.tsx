import { Link, useNavigate } from "react-router-dom";
import ShowImage from "./ShowImage";
import type { CardProps } from "../types";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import SoldBadge from "./SoldBadge";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { addToCart } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";

const ProductCard: React.FC<CardProps> = ({
    product,
    redirect = false
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        dispatch(addToCart(product));
        if (redirect) navigate("/cart");
    };
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
                    <ShowImage
                        item={product}
                        url="product"
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
                            {product.quantity > 0 && (
                                <>
                                    <Typography variant="body1">
                                        € {product.price}
                                    </Typography>
                                </>
                            )}
                            <ShoppingBagOutlinedIcon onClick={() => { handleAddToCart() }} fontSize="medium" sx={{ mt: 1, color: 'black' }} />
                        </Box>
                        <Typography
                            variant="subtitle1"
                            component="div">
                            {product.nameEn}
                        </Typography>
                        <Box component={Link} to={`/product/${product._id}`}>

                            {product.nameEn !== product.name && (
                                <Typography variant="body1" fontStyle="italic">
                                    {product.name}
                                </Typography>
                            )}
                        </Box>
                        {product.quantity !== 0 && (
                            <Typography sx={{ whiteSpace: "pre-wrap" }} color="#6c757d">{product.description}</Typography>
                        )}
                        <SoldBadge quantity={product.quantity} />
                    </Stack>
                </CardContent>
            </Box>
        </Card>
    );
};

export default ProductCard;

