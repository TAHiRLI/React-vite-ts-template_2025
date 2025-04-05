import { ROUTES } from "./routes";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/layout";
import PrivateRoute from "@/components/PrivateRoute/privateRoute";
import ForgotPasswordPage from "@/pages/login/forgotPassword";
import LoginPage from "@/pages/login/loginPage";
import HomePage from "@/pages/home/homePage";
import NotFoundPage from "@/pages/notFoundPage/notFoundPage";
// router.tsx
import TestRoleButtons from "@/components/testRoleButtons/testRoleButtons";
import { AdminPage, ManagerPage, SharedPage } from "@/pages/testPages/testPages";

export const router = createBrowserRouter(
    [
        {
            path: ROUTES.ADMIN,
            element: (
                <>
                    <TestRoleButtons />
                    <PrivateRoute roles={["admin"]}>
                        <Layout>
                            <AdminPage />
                        </Layout>
                    </PrivateRoute>
                </>
            ),
        },
        {
            path: ROUTES.MANAGER,
            element: (
                <>
                    <TestRoleButtons />
                    <PrivateRoute roles={["manager"]}>
                        <Layout>
                            <ManagerPage />
                        </Layout>
                    </PrivateRoute>
                </>
            ),
        },
        {
            path: ROUTES.SHARED,
            element: (
                <>
                    <TestRoleButtons />
                    <PrivateRoute roles={["admin", "manager"]}>
                        <Layout>
                            <SharedPage />
                        </Layout>
                    </PrivateRoute>
                </>
            ),
        },
        {
            path: ROUTES.LOGIN,
            element: (
                <LoginPage />
            ),
        },
        {
            path: ROUTES.FORGOT_PASSWORD,
            element: <ForgotPasswordPage />,
        },
        {
            path: ROUTES.BASE,
            element: (
                <>
                    <TestRoleButtons />
                    <PrivateRoute redirectUrl={ROUTES.BASE}>
                        <Layout>
                            <HomePage />
                        </Layout>
                    </PrivateRoute>
                </>
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
