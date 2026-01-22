import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import type { IProduct } from "../types";

interface ProductBreadcrumbsProps {
  product: IProduct;
}

const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({ product }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        component={RouterLink}
        to="/"
        underline="hover"
        color="inherit"
      >
        Home
      </Link>

      <Link
        component={RouterLink}
        to="/shop"
        underline="hover"
        color="inherit"
      >
        Shop
      </Link>

      {product.category && (
        <Link
          component={RouterLink}
          to={`/shop?category=${product.category._id}`}
          underline="hover"
          color="inherit"
        >
          {product.category.name}
        </Link>
      )}

      <Typography color="text.primary">
        {product.name}
      </Typography>
    </Breadcrumbs>
  );
};

export default ProductBreadcrumbs;