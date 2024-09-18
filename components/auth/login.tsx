"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { login } from "@/services/apiService";
import { Button, Input } from "@nextui-org/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const Login: React.FC = () => {
  const router = useRouter();

  const initialValues: LoginFormType = {
    username: "",
    password: "",
  };

  const handleLogin = useCallback(
    async (
      values: LoginFormType,
      { setErrors }: FormikHelpers<LoginFormType>
    ) => {
      try {
        const { user, token, companyId, userID } = await login(
          values.username,
          values.password
        );

        localStorage.setItem("authToken", token);
        localStorage.setItem("username", values.username);
        localStorage.setItem("companyId", companyId.toString());
        localStorage.setItem("userID", userID.toString());

        await createAuthCookie();
        router.replace("/");
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Invalid username or password")
        ) {
          setErrors({ username: "Invalid username or password" });
        } else {
          console.error("Login error:", error);
          setErrors({
            username: "An unexpected error occurred. Please try again.",
          });
        }
      }
    },
    [router]
  );

  return (
    <>
      <div className="text-center text-slate-400 text-[17px] font-[500] mb-6">
        Welcome to Kamak ERP
      </div>

      <div className="font-light text-slate-400 mb-[20px] text-sm">
        Please login to continue...
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col w-1/2 gap-4 mb-4">
              <Input
                variant="bordered"
                label="Username"
                type="text"
                value={values.username}
                isInvalid={!!errors.username && !!touched.username}
                errorMessage={errors.username}
                onChange={handleChange("username")}
              />
              <Input
                variant="bordered"
                label="Password"
                type="password"
                value={values.password}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
              />
            </div>

            <Button
              onPress={() => handleSubmit()}
              variant="flat"
              color="primary"
              className="font-semibold"
            >
              Login
            </Button>
          </>
        )}
      </Formik>
    </>
  );
};
