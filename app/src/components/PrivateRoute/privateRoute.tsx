import React, { ReactNode, useEffect, useState } from "react";

import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";

const cookies = new Cookies();

interface PrivateRouteProps {
  redirectUrl?: string; // Made callbackUrl optional
  children: ReactNode; // Directly specify children as ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectUrl, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Track authentication state
  const navigate = useNavigate();

  useEffect(() => {
    let user = cookies.get("user");
    
    if (user?.token) {
      setIsAuthenticated(true); // User is authenticated
    } else {
      setIsAuthenticated(false); // User is not authenticated
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: {
          redirectUrl,
        },
      });
    }
  }, [redirectUrl, navigate]);

  if (isAuthenticated === null) {
    // Show a loading spinner or blank state while checking authentication
    return <></>;
  }

  // Render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default PrivateRoute;