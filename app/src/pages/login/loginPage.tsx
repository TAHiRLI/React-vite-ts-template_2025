// loginPage.tsx
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/auth.slice";
import { AppDispatch, RootState } from "../../store/store";
import { LoginCredentials } from "../../lib/types/authTypes";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get auth state from Redux store instead of local state
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const redirectPath = new URLSearchParams(location.search).get("redirect") || ROUTES.BASE;

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  // Destructure useFormik hook directly
  const { values, touched, errors, handleChange, handleSubmit } = useFormik<LoginCredentials>({
    initialValues: { 
      username: "",
      password: "" 
    },
    validationSchema,
    onSubmit: (values) => {
      // Use the Redux action to handle login
      dispatch(loginUser({
        username: values.username,
        password: values.password
      }))
        .then(userData => {
          // Add token to URL for demo purposes (if needed)
          if (userData && userData.token) {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("token", userData.token);
            window.history.replaceState({}, '', currentUrl.toString());
          }
          // Navigation is handled by the useEffect
        })
        .catch(err => {
          // Error is handled by the Redux action
          console.error("Login failed:", err);
        });
    },
  });

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            variant="outlined"
            value={values.username}
            onChange={handleChange}
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
            disabled={loading}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            value={values.password}
            onChange={handleChange}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
            disabled={loading}
          />
          <Box sx={{ textAlign: "right", mt: 1 }}>
            <Link to={ROUTES.FORGOT_PASSWORD} style={{ textDecoration: "none", color: "#1976d2" }}>
              Forgot Password?
            </Link>
          </Box>
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
          <Typography sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link to={ROUTES.REGISTER} style={{ textDecoration: "none", color: "#1976d2" }}>
              Sign Up
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;