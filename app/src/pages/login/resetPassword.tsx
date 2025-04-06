import * as React from "react";
import * as yup from "yup";

import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { adminApiClient } from "../../API/apiClient";

import Cookies from "universal-cookie";
import { FC } from "react";
import Swal from "sweetalert2";
import { TUser } from "../../lib/types/authTypes";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

interface IResetPasswordFormValues {
    username: string;
    password: string;
    token: string;
    remember: boolean;
}

interface Props {
    username?: string | null;
    token: string;
}

interface ApiResponse {
    token?: string;
}

const ResetPassword: FC<Props> = ({ token, username }) => {
    //========================
    // Handle Translation
    //========================
    const [currentToken, setCurrentToken] = React.useState(token);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { t } = useTranslation();

    //========================
    // Form validation
    //========================
    const validationSchema = yup.object().shape({
        username: yup.string().required(t("requiredField")),
        password: yup
            .string()
            .required(t("requiredField"))
            .min(3, t("messages:passwordMin"))
    });

    //========================
    // Handle Form submit
    //========================
    const cookies = new Cookies();

    const handleFormSubmit = async (
        values: IResetPasswordFormValues,
        { setFieldError, setSubmitting }: FormikHelpers<IResetPasswordFormValues>
    ) => {
        setIsSubmitting(true);
        try {
            const res = await adminApiClient.post("api/auth/ResetPassword", { ...values, token: currentToken }, {
                validateStatus: () => true, // Prevent Axios from throwing errors
            });

            if (res.status === 601) {
                // Type checking the response data
                const responseData = res.data as ApiResponse;
                if (responseData.token) {
                    setCurrentToken(responseData.token);
                }
                setFieldError("password", t("messages:useDifferentPassword"));
            } else if (res.status === 200) {
                // Properly type the response data
                const userData = res.data as TUser & { expiresIn: string };
                const user: TUser = {
                    ...userData
                };

                // Parse the expiration date properly
                const expirationDate = typeof userData.expiresIn === 'string' 
                    ? dayjs(userData.expiresIn).toDate()
                    : userData.expiresIn;

                cookies.set("user", JSON.stringify(user), {
                    expires: expirationDate,
                    path: "/",
                });
                
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: t("messages:passwordResetSuccess"),
                    text: t("messages:passwordResetSuccessMessage")
                });
                
                // Redirect user or perform next steps
                // window.location.href = "/login"; // Uncomment if you want to redirect
            } else if (res.status === 498) {
                Swal.fire({
                    icon: 'error',
                    title: t("messages:tokenExpired"),
                    text: t("messages:tokenExpiredMessage")
                });
            } else {
                setFieldError("username", t("messages:resetPasswordError"));
                setFieldError("password", t("messages:resetPasswordError"));
                
                Swal.fire({
                    icon: 'error',
                    title: t("messages:error"),
                    text: t("messages:generalErrorMessage")
                });
            }
        } catch (err) {
            // Proper error handling
            console.error("Password reset error:", err);
            Swal.fire({
                icon: 'error',
                title: t("messages:error"),
                text: t("messages:networkErrorMessage")
            });
        } finally {
            setSubmitting(false);
            setIsSubmitting(false);
        }
    };

    //========================
    // Handle password show/hide
    //========================
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <>
            <h2>{t("static:resetPassword")}</h2>
            <p className="text-sm my-3">{t("static:resetPasswordMessage")}</p>

            <Formik<IResetPasswordFormValues>
                initialValues={{ username: username ?? "", password: "", token: currentToken, remember: false }}
                onSubmit={handleFormSubmit}
                validationSchema={validationSchema}
                enableReinitialize={true}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting: formikSubmitting }) => (
                    <form onSubmit={handleSubmit} className="flex flex-col grow gap-5 justify-evenly">
                        <TextField
                            id="username"
                            label={t("user:username")}
                            required
                            variant="outlined"
                            type="text"
                            name="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                            error={!!touched.username && !!errors.username}
                            helperText={touched.username && errors.username}
                            disabled={isSubmitting || formikSubmitting}
                        />

                        <TextField
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            label={t("user:newPassword")}
                            id="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            error={!!touched.password && !!errors.password}
                            helperText={touched.password && errors.password}
                            required
                            disabled={isSubmitting || formikSubmitting}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            disabled={isSubmitting || formikSubmitting}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button 
                            variant="contained" 
                            type="submit" 
                            disabled={isSubmitting || formikSubmitting}
                        >
                            {isSubmitting || formikSubmitting ? t("static:submitting") : t("static:submit")}
                        </Button>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default ResetPassword;