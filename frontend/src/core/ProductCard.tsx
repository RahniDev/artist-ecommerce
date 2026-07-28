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

After it's added, the button could change to:

Added to Collection

Next on the collection page:

┌─────────────────────────────┐

        [ Painting ]

The Quiet Between      View details

└─────────────────────────────┘

definitely wouldn't use a filled button.

Buttons immediately say:

Buy me.

Instead, I'd make it look like a subtle text link.

For example:

The Quiet Between      View details →
with a very subtle underline appearing only on hover.

Title:

Instrument Serif
18–22px
Medium weight

View details:

Inter
14px
Regular
Slightly lighter colour

The title should naturally draw the eye first.

Alignment

I'd also keep the width of the text aligned with the painting.

┌──────────────────────┐
│                      │
│      Painting        │
│                      │
└──────────────────────┘

The Quiet Between      View details →

Not centred underneath.

The left/right alignment gives it a quiet, editorial feel.

One thing I might even do

Instead of "View details", consider:

View work →
View artwork →
Open →

I actually like View work → best for your site.

It sounds less like inspecting product specifications and more like entering the artwork.

So my preferred layout would be:

The Quiet Between                    View work →

It's subtle, balanced, and keeps the focus on the painting rather than on navigation. It also reinforces the feeling that you're moving from the gallery room into a dedicated space for that single work, rather than opening a product page in a typical online shop.
                 */}
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
                            <Link to={`/product/${product._id}`} style={{ fontSize: "16px", marginTop: 1, color: textColor, marginRight: "2rem" }}>View details</Link>
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

