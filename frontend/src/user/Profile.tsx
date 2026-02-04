import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import { read, update, updateUser } from "./apiUser";
import type { ProfileState } from "../types";
import { useTranslation } from "react-i18next";
const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const auth = isAuthenticated();
  const { t } = useTranslation();

  if (!auth) {
    return <Navigate to="/signin" replace />;
  }

  const { token, user } = auth;


  const [values, setValues] = useState<ProfileState>({
    name: "",
    email: "",
    password: "",
    error: false,
    success: false,
  });

  const { name, email, password, error, success } = values;

  const init = async (id: string) => {
    const res = await read(id, token);

    if (res.error) {
      setValues(prev => ({ ...prev, error: true }));
      return;
    }

    const user = res.data;
    if (!user) return;

    setValues(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
    }));
  };

  useEffect(() => {
    if (userId) init(userId);
  }, [userId]);

  const handleChange =
    (field: keyof ProfileState) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({
          ...prev,
          error: false,
          [field]: e.target.value,
        }));
      };

  const clickSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!userId) return;

    const res = await update(userId, token, { name, email, password });

    if (res.error) {
      console.log(res.error);
      return;
    }

    if (!res.data) return;

    updateUser(res.data, () => {
      setValues((prev) => ({
        ...prev,
        name: res.data!.name,
        email: res.data!.email,
        success: true,
      }));
    });
  };

const profileUpdateForm = () => (
  <Box
    component="form"
    sx={{ maxWidth: 400 }}
  >
    <Stack spacing={2}>
      <TextField
        label={t("name")}
        value={name}
        onChange={handleChange("name")}
        placeholder={user.name}
        fullWidth
      />

      <TextField
        label={t("email")}
        type="email"
        value={email}
        onChange={handleChange("email")}
        placeholder={user.email}
        fullWidth
      />

      <TextField
        label={t("password")}
        type="password"
        value={password}
        onChange={handleChange("password")}
        fullWidth
      />

      <Button
        variant="contained"
        size="large"
        onClick={clickSubmit}
      >
        {t("update")}
      </Button>
    </Stack>
  </Box>
);

  if (success) {
    return <Navigate to="/cart" replace />;
  }

  if (success) {
  return <Navigate to="/cart" replace />;
}

return (
  <Layout
    title="Profile"
    description="Update your profile"
  >
    <Box maxWidth="md" mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Update profile
      </Typography>

      {profileUpdateForm()}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Something went wrong
        </Alert>
      )}
    </Box>
  </Layout>
);
}

export default Profile;