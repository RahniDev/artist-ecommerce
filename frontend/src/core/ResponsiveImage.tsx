import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import type { Product } from "../types";

type Props = {
  photo: Product["photos"][number];
  alt: string;
  sizes: string;
  sx?: SxProps;
  onClick?: () => void;
};

const ResponsiveImage = ({
  photo,
  alt,
  sizes,
  sx,
  onClick,
}: Props) => {

if (!photo?.sizes) {
  console.error("Invalid photo object:", photo);

  return (
    <Box
      component="img"
      src={photo.url}
      alt={alt}
      sizes={sizes}
      loading="lazy"
      decoding="async"
      sx={sx}
    />
  );
}

const fallback =
  sizes === "60px"
    ? photo.sizes.xs
    : photo.sizes.md;
  const srcSet = [
    `${photo.sizes.xs} 160w`,
    `${photo.sizes.sm} 320w`,
    `${photo.sizes.md} 640w`,
    `${photo.sizes.lg} 960w`,
    `${photo.sizes.xl} 1600w`,
  ].join(", ");

  return (
    <Box
      component="img"
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      loading="lazy"
      decoding="async"
      alt={alt}
      onClick={onClick}
      sx={sx}
    />
  );
};

export default ResponsiveImage;