import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

export default function Newsletter() {
  return (
   <Box>
      <Typography variant="h6" gutterBottom>
        Newsletter
      </Typography>
      <Box
        component="form"
        action="https://gmail.us3.list-manage.com/subscribe/post?u=c4db4caa3741bf741e810fba9&id=9b6a0b46d5&f_id=003c27e1f0"
        method="post"
        target="_blank"
        noValidate
        sx={{ display: "flex", gap: 1 }}
      >
        <TextField
          type="email"
          name="EMAIL"
          placeholder="Enter your email"
          required
          size="small"
          variant="outlined"
        />
        <Button type="submit" variant="contained">
          Subscribe
        </Button>
      </Box>
    </Box>
  );
}