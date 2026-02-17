"use client";

import { getUserByIdApi, patchUserByIdApi } from "@/shared/api/user/userApi";
import Navbar from "@/shared/components/fragments/Navbar";
import Form, {
  formStateAtom,
  toastStateAtom,
} from "@/shared/components/ui/Form";
import Loading from "@/shared/components/ui/Loading";
import Wrapper from "@/shared/components/ui/Wrapper";
import { useAuthentication } from "@/shared/hooks/useAuthentication";
import { meSessionStateAtom } from "@/shared/stores/meSessionStore";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

const AccountSettingsPage = () => {
  const [formState, setFormState] = useAtom(formStateAtom);
  const [{ me }, setMeSessionState] = useAtom(meSessionStateAtom);
  const setToastState = useSetAtom(toastStateAtom);
  const [type, setType] = useState<"account settings" | "change password">(
    "account settings",
  );

  const router = useRouter();

  const successFunc = async () => {
    if (!me) {
      return router.push("/");
    }

    const response = await getUserByIdApi(me.id);
    if (response?.data && !response?.error) {
      setFormState({
        fullname: response.data.fullname,
        username: response.data.username,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  };

  const { isLoadingState } = useAuthentication(successFunc);

  const handleUpdateAccount = async () => {
    const fileElement = document.getElementById("image") as HTMLInputElement;
    const file = fileElement?.files && fileElement.files[0];

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("username", formState["username"]);
    formData.append("fullname", formState["fullname"]);

    const patchResponse = await patchUserByIdApi(me!.id!, formData, "");
    if (patchResponse?.data && !patchResponse?.error) {
      setMeSessionState((prev) => ({
        ...prev,
        me: patchResponse!.data!,
      }));

      setToastState({
        isVisible: true,
        type: "success",
        messages: ["Update Account Success!"],
      });

      setTimeout(() => {
        setToastState((prev) => ({ ...prev, isVisible: false }));
      }, 5000);
    }

    if (patchResponse?.error) {
      const messages = patchResponse?.message as string;

      setToastState({
        isVisible: true,
        type: "error",
        messages: messages?.split("\n\n"),
      });

      setTimeout(() => {
        setToastState((prev) => ({ ...prev, isVisible: false }));
      }, 5000);
    }
  };

  const handleUpdatePassword = async () => {
    if (
      formState["oldPassword"] === "" &&
      formState["newPassword"] === "" &&
      formState["confirmNewPassword"] === ""
    ) {
      setToastState({
        isVisible: true,
        type: "error",
        messages: [
          "Old password, new password and confirm new password can't be empty!",
        ],
      });

      setTimeout(() => {
        setToastState((prev) => ({ ...prev, isVisible: false }));
      }, 5000);

      return;
    }

    if (formState["confirmNewPassword"] !== formState["newPassword"]) {
      setToastState({
        isVisible: true,
        type: "error",
        messages: ["New password and confirm new password must be same!"],
      });

      setTimeout(() => {
        setToastState((prev) => ({ ...prev, isVisible: false }));
      }, 5000);

      return;
    }

    const formData = new FormData();
    formData.append("oldPassword", formState["oldPassword"]);
    formData.append("password", formState["newPassword"]);

    const patchResponse = await patchUserByIdApi(me!.id!, formData, "");
    if (patchResponse?.data && !patchResponse?.error) {
      setToastState({
        isVisible: true,
        type: "success",
        messages: ["Update Password Success!"],
      });

      setTimeout(() => {
        setToastState((prev) => ({ ...prev, isVisible: false }));
      }, 5000);

      return;
    }

    if (patchResponse?.error) {
      const messages = patchResponse.message as string;

      setToastState({
        isVisible: true,
        type: "error",
        messages: messages.split("\n\n"),
      });

      setTimeout(() => {
        setToastState((prev) => ({ ...prev, isVisible: false }));
      }, 5000);

      return;
    }
  };

  if (isLoadingState) {
    return <Loading />;
  }

  return (
    <Suspense>
      <Navbar />
      <Wrapper>
        <div className="w-full flex flex-col justify-center items-center bg-primary text-text rounded-sm p-4 gap-8">
          {type === "account settings" && (
            <div className="w-full flex flex-col justify-center items-center gap-2">
              <h3 className="w-full text-xl font-bold">Account Settings</h3>
              <Form onSubmit={handleUpdateAccount}>
                <Form.Input htmlFor="fullname" text="Fullname" type="text" />
                <Form.File htmlFor="image" text="Profile Picture" />
                <Form.Input htmlFor="username" text="Username" type="text" />
                <Form.Toast />
                <Form.Button
                  useMarginTop
                  marginTop="4px"
                  text="Update Account"
                />
              </Form>
              <Form.Button
                text="Change Password"
                useMarginTop
                marginTop="16px"
                onClick={() => setType("change password")}
              />
            </div>
          )}
          {type === "change password" && (
            <div className="w-full flex flex-col justify-center items-center gap-2">
              <h3 className="w-full text-xl font-bold">Change Password</h3>
              <Form onSubmit={handleUpdatePassword}>
                <Form.Input
                  htmlFor="oldPassword"
                  text="Old Password"
                  type="password"
                />
                <Form.Input
                  htmlFor="newPassword"
                  text="New Password"
                  type="password"
                />
                <Form.Input
                  htmlFor="confirmNewPassword"
                  text="Confirm New Password"
                  type="password"
                />
                <Form.Toast />
                <Form.Button
                  useMarginTop
                  marginTop="4px"
                  text="Change Password"
                />
              </Form>
              <Form.Button
                text="Account Settings"
                useMarginTop
                marginTop="16px"
                onClick={() => setType("account settings")}
              />
            </div>
          )}
        </div>
      </Wrapper>
    </Suspense>
  );
};

export default AccountSettingsPage;
