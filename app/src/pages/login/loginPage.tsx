// loginPage.tsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from "@mui/material";
import Cookies from "universal-cookie";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/router/routes";

const cookies = new Cookies();

// Define the user type as mentioned in your requirements
type User = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  roles: string[];
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("redirect") || ROUTES.BASE;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initial auth state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  });

  const formik = useFormik<{ email: string; password: string }>({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setError(null);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulate API delay
      setTimeout(() => {
        try {
          // Create a full user object matching the required structure
          const user: User = {
            id: "user-123",
            fullname: "Demo User",
            username: values.email.split('@')[0],
            email: values.email,
            roles: ["user"]
          };
          
          // Create userData with token and user info
          const userData = { 
            token: "test-token-" + Math.random().toString(36).substring(2),
            ...user
          };
          
          // Update auth state
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
          // Save in cookies as before
          cookies.set("user", userData, { path: "/", secure: true, sameSite: "strict" });
          
          // Add token to URL for demo purposes
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set("token", userData.token);
          window.history.replaceState({}, '', currentUrl.toString());
          
          // Navigate to redirect path after login
          navigate(redirectPath);
        } catch (err) {
          setError("Login failed. Please try again.");
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: "Login failed. Please try again."
          }));
        } finally {
          setLoading(false);
        }
      }, 700); // Add slight delay to simulate API call
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
        
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
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