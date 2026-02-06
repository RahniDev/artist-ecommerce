import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import { read, update } from "./apiUser";
import { useTranslation } from "react-i18next";

import type { ProfileState } from "../types";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { setAuth } from "../redux/slices/authSlice";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { user, token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const { t } = useTranslation();

  // If user not authenticated, redirect
  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  const [values, setValues] = useState<ProfileState>({
    name: "",
    email: "",
    password: "",
    error: false,
    success: false,
  });

  const { name, email, password, error, success } = values;

  // Load user data
  const init = async (id: string) => {
    if (!token) return;

    const res = await read(id, token);

    if (res.error) {
      setValues((prev) => ({ ...prev, error: true }));
      return;
    }

    const userData = res.data;
    if (!userData) return;

    setValues((prev) => ({
      ...prev,
      name: userData.name,
      email: userData.email,
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
    if (!userId || !token) return;

    const res = await update(userId, token, { name, email, password });

    if (res.error) {
      setValues((prev) => ({ ...prev, error: true }));
      console.log(res.error);
      return;
    }

    if (!res.data) return;

    // Update auth in Redux (instead of localStorage here)
    dispatch(setAuth({ user: res.data, token }));

    setValues((prev) => ({
      ...prev,
      success: true,
      password: "",
    }));
  };

  const profileUpdateForm = () => (
    <Box component="form" sx={{ maxWidth: 400 }}>
      <Stack spacing={2}>
        <TextField
          label={t("name")}
          value={name}
          onChange={handleChange("name")}
          placeholder={user?.name}
          fullWidth
        />

        <TextField
          label={t("email")}
          type="email"
          value={email}
          onChange={handleChange("email")}
          placeholder={user?.email}
          fullWidth
        />

        <TextField
          label={t("password")}
          type="password"
          value={password}
          onChange={handleChange("password")}
          fullWidth
        />

        <Button variant="contained" size="large" onClick={clickSubmit}>
          {t("update")}
        </Button>
      </Stack>
    </Box>
  );

  if (success) return <Navigate to="/cart" replace />;

  return (
    <Layout title="Profile" description="Update your profile">
      <Box maxWidth="md" mx="auto" mt={4}>
        <Typography variant="h5" gutterBottom>
          Update profile
        </Typography>

        {profileUpdateForm()}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {t("something_went_wrong")}
          </Alert>
        )}
      </Box>
    </Layout>
  );
};

export default Profile;
