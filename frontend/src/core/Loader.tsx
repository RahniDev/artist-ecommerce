import { Box, CircularProgress } from "@mui/material";

interface LoaderProps {
  loading: boolean;
  center?: boolean;
  marginY?: number;
}

const Loader: React.FC<LoaderProps> = ({
  loading,
  center = true,
  marginY = 4,
}) => {
  if (!loading) return null;

  return (
    <Box
      sx={{
        display: center ? "flex" : "block",
        justifyContent: center ? "center" : undefined,
        my: marginY,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
