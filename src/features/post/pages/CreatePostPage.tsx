"use client";

import { postPostApi } from "@/shared/api/post/postApi";
import Navbar from "@/shared/components/fragments/Navbar";
import Form, {
  formStateAtom,
  toastStateAtom,
} from "@/shared/components/ui/Form";
import Loading from "@/shared/components/ui/Loading";
import Wrapper from "@/shared/components/ui/Wrapper";
import { useAuthentication } from "@/shared/hooks/useAuthentication";
import { meSessionStateAtom } from "@/shared/stores/meSessionStore";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

const CreatePostPage = () => {
  const { me } = useAtomValue(meSessionStateAtom);

  const [formState, setFormState] = useAtom(formStateAtom);
  const setToastState = useSetAtom(toastStateAtom);

  const { isLoadingState } = useAuthentication();

  const handlePost = async () => {
    const fileElement = document.getElementById("image") as HTMLInputElement;
    const file = fileElement?.files && fileElement.files[0];

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("caption", formState["caption"]);
    formData.append("userId", me!.id!);

    const postResponse = await postPostApi(formData, "");

    if (postResponse?.data && !postResponse?.error) {
      setToastState({
        isVisible: true,
        type: "success",
        messages: ["Post a meme success!"],
      });

      setTimeout(() => {
        setToastState((prev) => ({ ...prev, isVisible: false }));
        window.location.href = "/";
      }, 5000);
    }

    if (postResponse?.error) {
      const messages = postResponse.message as string;

      setToastState({
        isVisible: true,
        type: "error",
        messages: messages.split("\n\n"),
      });

      setTimeout(() => {
        setToastState((prev) => ({ ...prev, isVisible: false }));
      }, 5000);
    }
  };

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      caption: "",
    }));
  }, [setFormState]);

  if (isLoadingState) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <Wrapper>
        <div className="w-full flex flex-col justify-center items-center bg-primary text-text rounded-sm p-4 gap-4">
          <h3 className="w-full text-xl font-bold">Post a Meme</h3>
          <Form onSubmit={handlePost}>
            <Form.TextArea htmlFor="caption" text="Caption" />
            <Form.File htmlFor="image" text="Meme Image" />
            <Form.Toast />
            <Form.Button text="Post" useMarginTop />
          </Form>
        </div>
      </Wrapper>
    </>
  );
};

export default CreatePostPage;
