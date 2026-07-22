import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../redux/store";
import { Box, Typography } from "@mui/material";

const Collections = () => {
    const categories = useSelector(
        (state: RootState) => state.categories.items
    );

    return (
        <Box>
            {categories.map((category) => (
                <Box key={category._id} sx={{ mb: 4 }}>
                    <Typography
                        component={Link}
                        to={`/collection/${category._id}`}
                        variant="h2"
                    >
                        {category.name}
                    </Typography>

                    {category.name === "Collections" &&
                        category.subcategories?.map((subcategory) => (
                            <Typography
                                key={subcategory._id}
                                component={Link}
                                to={`/collection/${subcategory._id}`}
                                sx={{
                                    display: "block",
                                    mt: 1,
                                }}
                            >
                                {subcategory.name}
                            </Typography>
                        ))}
                </Box>
            ))}
        </Box>
    );
};

export default Collections;