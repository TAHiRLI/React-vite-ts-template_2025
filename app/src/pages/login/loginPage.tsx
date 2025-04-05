import React from "react";
import { useSearchParams } from "react-router-dom";
import TestRoleButtons from "@/components/testRoleButtons/testRoleButtons";

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <TestRoleButtons redirectTo={redirectTo} />

      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <p className="text-center mb-4">
          This is the test login page. You can log in with different roles using the buttons above.
        </p>
        <p className="text-center text-sm text-gray-500">
          Address to be forwarded: {redirectTo}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
