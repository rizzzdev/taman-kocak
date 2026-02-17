"use client";

import Navbar from "@/shared/components/fragments/Navbar";
import Wrapper from "@/shared/components/ui/Wrapper";
import Link from "next/link";
import RegisterForm from "../components/RegisterForm";
import { useAtom, useSetAtom } from "jotai";
import { formStateAtom, toastStateAtom } from "@/shared/components/ui/Form";
import { postUserApi } from "@/shared/api/user/userApi";
import { useEffect } from "react";

const RegisterPage = () => {
  const [formState, setFormState] = useAtom(formStateAtom);
  const setToastState = useSetAtom(toastStateAtom);

  const handleSubmit = async () => {
    const formData = new FormData();
    const fileInputElemment = document.getElementById(
      "image",
    ) as HTMLInputElement;
    const file = fileInputElemment!.files![0];

    if (file) {
      formData.append("image", file);
    }

    formData.append("fullname", formState["fullname"]);
    formData.append("username", formState["username"]);
    formData.append("password", formState["password"]);

    const registerResponse = await postUserApi(formData, "");

    if (!registerResponse?.error && registerResponse?.data) {
      setToastState({
        isVisible: true,
        type: "success",
        messages: ["Register success!"],
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);

      return;
    }

    if (registerResponse?.error) {
      const message = registerResponse.message as string;

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
      fullname: "",
      username: "",
      password: "",
    }));
  }, [setFormState]);

  return (
    <>
      <Navbar />
      <Wrapper>
        <div className="w-full flex flex-col justify-center items-center bg-primary text-text rounded-sm p-4 gap-4">
          <h3 className="w-full text-xl font-bold">Register to Taman Kocak</h3>
          <RegisterForm onSubmit={handleSubmit} />
          <div className="w-full flex justify-center items-center mt-8 gap-2">
            <p className=" text-sm">Already have account?</p>
            <Link
              href={"/login"}
              className="text-sm hover:font-semibold hover:underline"
            >
              Login here!
            </Link>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default RegisterPage;
