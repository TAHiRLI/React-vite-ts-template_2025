import { ROUTES } from "./routes";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/layout";
import PrivateRoute from "@/components/PrivateRoute/privateRoute";
import ForgotPasswordPage from "@/pages/login/forgotPassword";
import LoginPage from "@/pages/login/loginPage";
import HomePage from "@/pages/home/homePage";
import NotFoundPage from "@/pages/notFoundPage/notFoundPage";

export const router = createBrowserRouter(
    [
        {
            path: ROUTES.LOGIN,
            element: <LoginPage />,
        },
        {
            path: ROUTES.FORGOT_PASSWORD,
            element: <ForgotPasswordPage />,
        },
        {
            path: ROUTES.BASE,
            element: (
                <PrivateRoute redirectUrl={ROUTES.BASE}>
                    <Layout>
                        <HomePage />
                    </Layout>
                 </PrivateRoute>
            ),
        },
        {
            path: "*",
            element: <NotFoundPage />
        }
    ],
    {
        future: {
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_relativeSplatPath: true,
            v7_skipActionErrorRevalidation: true,
        },
    }
);
