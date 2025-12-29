import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { useParams, Navigate } from "react-router-dom";
import { read, update, updateUser } from "./apiUser";


interface ProfileState {
  name: string;
  email: string;
  password: string;
  error: boolean;
  success: boolean;
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const auth = isAuthenticated();

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
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          onChange={handleChange("name")}
          className="form-control"
          value={name}
          placeholder={user.name}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          onChange={handleChange("email")}
          className="form-control"
          value={email}
          placeholder={user.email}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          onChange={handleChange("password")}
          className="form-control"
          value={password}
        />
      </div>

      <button className="btn btn-primary" onClick={clickSubmit}>
        Submit
      </button>
    </form>
  );

  if (success) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <Layout
      title="Profile"
      description="Update your profile"
      className="container-fluid"
    >
      <h2 className="mb-4">Profile update</h2>
      {profileUpdateForm()}
      {error && <div className="alert alert-danger">Something went wrong</div>}
    </Layout>
  );
};

export default Profile;