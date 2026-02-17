"use client";

import Navbar from "@/shared/components/fragments/Navbar";
import PostCard from "../components/PostCard";
import Wrapper from "@/shared/components/ui/Wrapper";
import { useAuthentication } from "@/shared/hooks/useAuthentication";
import Loading from "@/shared/components/ui/Loading";
import { useAtom } from "jotai";
import { postStateAtom } from "@/shared/stores/post/postStore";
import { getPostByIdApi } from "@/shared/api/post/postApi";
import { useParams, useRouter } from "next/navigation";
import { postCommentApi } from "@/shared/api/comment/commentApi";
import { formStateAtom } from "@/shared/components/ui/Form";

const ViewPostPage = () => {
  const [postState, setPostState] = useAtom(postStateAtom);
  const [formState, setFormState] = useAtom(formStateAtom);
  const id = useParams().id as string;
  const router = useRouter();

  const successFunc = async () => {
    const response = await getPostByIdApi(
      id,
      "includeUser=1&includeReposts=1&includeBookmarks=1&includeComments=1&includeLikes=1",
    );

    if (response?.data && !response?.error) {
      return setPostState(response.data);
    }

    router.push("/");
  };

  const { isLoadingState, meSessionState } = useAuthentication(successFunc);

  const handleComment = async () => {
    const response = await postCommentApi({
      postId: id,
      text: formState["text"] || "",
      userId: meSessionState!.me!.id!,
    });

    if (!response?.error) {
      setFormState({});
    }

    return !response?.error;
  };

  if (isLoadingState) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <Wrapper width="medium">
        {postState && (
          <PostCard
            post={postState}
            user={postState!.user!}
            includeComments
            onSubmitComment={handleComment}
          />
        )}
      </Wrapper>
    </>
  );
};

export default ViewPostPage;
