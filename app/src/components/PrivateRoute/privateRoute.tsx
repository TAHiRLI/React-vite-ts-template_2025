import React, { ReactNode, useEffect, useState } from "react";

import Cookies from "universal-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";

const cookies = new Cookies();

interface PrivateRouteProps {
  redirectUrl?: string; // Made callbackUrl optional
  roles?: string; // Made roles optional
  children: ReactNode; // Directly specify children as ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectUrl, roles, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Track authentication state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let user = cookies.get("user");

    if (!user?.token) {
      // User is not authenticated
      setIsAuthenticated(false);

      // Capture current location for redirection
      const currentPath = location.pathname + location.search;
      const redirectPath = redirectUrl || currentPath;

      // Redirect to login with the redirect parameter in URL (not state)
      navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    // User is authenticated, now check roles if specified
    if (roles) {
      const userRole = user.role;

      if (userRole !== roles) {
        // User lacks required roles
        alert(`You are not authorized. Only users with the role ${roles} can view this page.`);

        // Capture current location for redirection
        const currentPath = location.pathname + location.search;
        const redirectPath = redirectUrl || currentPath;

        // Redirect to login with the redirect parameter
        navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectPath)}`);
        return;
      }
    }

    // User is authenticated and has required roles (if specified)
    setIsAuthenticated(true);
  }, [redirectUrl, roles, navigate, location]);

  if (isAuthenticated === null) {
    // Show a loading spinner or blank state while checking authentication
    return <></>;
  }

  // Render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default PrivateRoute;