import { Box } from "@mui/material";
import type { Category } from "../types";

interface Props {
  categories: Category[];
  navigate: ReturnType<any>;
}

const CategoryDropdown = ({
  categories,
  navigate,
}: Props) => {
  return (
    <Box>
      {categories.map((category) => (
        <Box
          key={category._id}
          sx={{
            position: "relative",
            px: 2,
            py: 1,
            cursor: "pointer",
            whiteSpace: "nowrap",

            "&:hover": {
              backgroundColor: "#f5f5f5",
            },

            // important: descendant, not direct child
            "&:hover .children": {
              display: "block",
            },
          }}
        >
          <Box
            onClick={() =>
              navigate(`/collection/${category._id}`)
            }
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {category.name}

            {category.subcategories &&
              category.subcategories.length > 0 && (
                <Box component="span" sx={{ ml: 3 }}>
                  ›
                </Box>
              )}
          </Box>


          {category.subcategories &&
            category.subcategories.length > 0 && (
              <Box
                className="children"
                sx={{
                  display: "none",
                  position: "absolute",
                  left: "calc(100% - 1px)",
                  top: 0,
                  bgcolor: "white",
                  minWidth: 220,
                  boxShadow: 3,
                  zIndex: 1500,

                  // keeps submenu open while moving mouse
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    left: "-10px",
                    top: 0,
                    width: "10px",
                    height: "100%",
                  },
                }}
              >
                <CategoryDropdown
                  categories={category.subcategories}
                  navigate={navigate}
                />
              </Box>
            )}
        </Box>
      ))}
    </Box>
  );
};

export default CategoryDropdown;