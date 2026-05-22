import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IProduct } from "../types";

interface ProductBreadcrumbsProps {
  product: IProduct;
}

const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({ product }) => {
  const { t } = useTranslation();

  const breadcrumbItems: { name: string; url: string }[] = [
    { name: t("home"), url: "/" }
  ];

  if (product.category) {
    breadcrumbItems.push({
      name: product.category.name,
      url: `/category/${product.category._id}`,
    });
  }

  breadcrumbItems.push({
    name: product.name,
    url: "", // Current page
  });

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": window.location.origin + item.url, // full URL
    })),
  };

  return (
    <>
      {/* Visible breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbItems.map((item, idx) =>
          idx === breadcrumbItems.length - 1 ? (
            <Typography key={idx} color="text.primary">
              {item.name}
            </Typography>
          ) : (
            <Link
              key={idx}
              component={RouterLink}
              to={item.url}
              underline="hover"
              color="inherit"
            >
              {item.name}
            </Link>
          )
        )}
      </Breadcrumbs>

      {/* SEO breadcrumbs (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </>
  );
};

export default ProductBreadcrumbs;