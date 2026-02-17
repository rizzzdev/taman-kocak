"use client";

import Navbar from "@/shared/components/fragments/Navbar";
import Wrapper from "@/shared/components/ui/Wrapper";
import LoginForm from "../components/LoginForm";
import Link from "next/link";
import { useAtom, useSetAtom } from "jotai";
import { formStateAtom, toastStateAtom } from "@/shared/components/ui/Form";
import { postSessionApi } from "@/shared/api/session/sessionApi";
import { useEffect } from "react";

const LoginPage = () => {
  const [formState, setFormState] = useAtom(formStateAtom);
  const setToastState = useSetAtom(toastStateAtom);

  const handleSubmit = async () => {
    const loginResponse = await postSessionApi({
      username: formState.username,
      password: formState.password,
    });

    if (!loginResponse?.error && loginResponse?.data) {
      window.localStorage.setItem(
        "accessToken",
        loginResponse.data!.accessToken!,
      );

      setToastState({
        isVisible: true,
        type: "success",
        messages: ["Login success!"],
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 5000);

      return;
    }

    if (loginResponse?.error) {
      const message = loginResponse.message as string;

      setToastState({
        isVisible: true,
        type: "error",
        messages: message.split("\n\n"),
      });

      setTimeout(() => {
        setToastState({
          isVisible: false,
          type: "error",
          messages: [],
        });
      }, 5000);
    }
  };

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      username: "",
      password: "",
    }));
  }, [setFormState]);

  return (
    <>
      <Navbar />
      <Wrapper>
        <div className="w-full flex flex-col justify-center items-center bg-primary text-text rounded-sm p-4 gap-4">
          <h3 className="w-full text-xl font-bold">Login to Taman Kocak</h3>
          <LoginForm onSubmit={handleSubmit} />
          <div className="w-full flex justify-center items-center mt-8 gap-2">
            <p className=" text-sm">Do not have account?</p>
            <Link
              href={"/register"}
              className="text-sm hover:font-semibold hover:underline"
            >
              Register here!
            </Link>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default LoginPage;
