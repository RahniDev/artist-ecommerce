import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ProductImage from "./ProductImage";

interface ImageModalProps {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, bgcolor: "background.paper" }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, display: "flex", justifyContent: "center", bgcolor: "black" }}>
        <ProductImage
          item={{ _id: "" }}
          url="product"
          sizes="(max-width: 600px) 100vw, 33vw"
          width="100%"
          height="auto"
        //objectFit: "contain"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;