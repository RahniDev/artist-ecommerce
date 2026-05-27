import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ImageModalProps {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ open, src, alt, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, bgcolor: "background.paper" }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, display: "flex", justifyContent: "center", bgcolor: "black" }}>
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{ maxHeight: "90vh", maxWidth: "100%", objectFit: "contain" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;