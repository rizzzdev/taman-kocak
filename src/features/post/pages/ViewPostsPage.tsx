"use client";

import PostLists from "@/features/post/components/PostLists";
import { getPostsApi } from "@/shared/api/post/postApi";
import Navbar from "@/shared/components/fragments/Navbar";
import Loading from "@/shared/components/ui/Loading";
import Wrapper from "@/shared/components/ui/Wrapper";
import { envConfig } from "@/shared/configs/envConfig";
import { useAuthentication } from "@/shared/hooks/useAuthentication";
import { postsStateAtom } from "@/shared/stores/post/postStore";
import { useAtom } from "jotai";

const ViewPostsPage = () => {
  const [postsLists, setPostsLists] = useAtom(postsStateAtom);

  console.log({ envConfig });
  console.log({ name: "maull" });

  const successFunc = async () => {
    const response = await getPostsApi(
      "includeUser=1&includeReposts=1&includeBookmarks=1&includeComments=1&includeLikes=1",
    );

    if (response?.data && !response?.error) {
      setPostsLists(response.data);
    }
  };

  const { isLoadingState } = useAuthentication(successFunc);

  if (isLoadingState) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <Wrapper>
        <PostLists postLists={postsLists} />
      </Wrapper>
    </>
  );
};

export default ViewPostsPage;
