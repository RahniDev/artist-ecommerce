import { useState, type ChangeEvent, type FormEvent } from 'react'
import { API } from '../config';
import { Box, Button, TextField, Alert, Typography } from "@mui/material";
import type { ContactFormState } from '../types';

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
    loading: false,
    success: null,
    error: null,
  });

  const handleChange =
    (field: keyof ContactFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev: ContactFormState) => ({
        ...prev,
        [field]: e.target.value,
        error: null,
        success: null,
      }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setForm((prev: ContactFormState) => ({ ...prev, loading: true, error: null, success: null }));

    try {
      const body = JSON.stringify({
        name: form.name,
        email: form.email,
        message: form.message,
      });

      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setForm({
        name: "",
        email: "",
        message: "",
        loading: false,
        success: true,
        error: null,
      });
    } catch (err: any) {
      setForm((prev: ContactFormState) => ({
        ...prev,
        loading: false,
        success: false,
        error: err.message || "Failed to send message",
      }));
    }
  };

  return (
  <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500, mx: "auto", mt: 4 }}
    >
      <Typography variant="h5" align="center">Contact Us</Typography>

      {form.success && <Alert severity="success">Message sent successfully!</Alert>}
      {form.success === false && <Alert severity="error">{form.error}</Alert>}

      <TextField
        label="Name"
        value={form.name}
        onChange={handleChange("name")}
        required
        fullWidth
      />

      <TextField
        label="Email"
        type="email"
        value={form.email}
        onChange={handleChange("email")}
        required
        fullWidth
      />

      <TextField
        label="Message"
        value={form.message}
        onChange={handleChange("message")}
        required
        multiline
        rows={4}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        disabled={form.loading}
      >
        {form.loading ? "Sending..." : "Send Message"}
      </Button>
    </Box>
  );
};

export default Contact;
