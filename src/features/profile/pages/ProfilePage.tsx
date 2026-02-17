"use client";

import Navbar from "@/shared/components/fragments/Navbar";
import Wrapper from "@/shared/components/ui/Wrapper";
import ProfileCard from "../components/ProfileCard";
import PostLists from "@/features/post/components/PostLists";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userStateAtom } from "@/shared/stores/user/userStore";
import { useAuthentication } from "@/shared/hooks/useAuthentication";
import { useParams, useRouter } from "next/navigation";
import { getUserByIdApi } from "@/shared/api/user/userApi";
import Loading from "@/shared/components/ui/Loading";
import { postsStateAtom } from "@/shared/stores/post/postStore";
import { getPostByIdApi } from "@/shared/api/post/postApi";

const ProfilePage = () => {
  const [userState, setUserState] = useAtom(userStateAtom);
  const [postsState, setPostsState] = useAtom(postsStateAtom);

  const [activeMenu, setActiveMenu] = useState<
    "posts" | "reposts" | "bookmarks"
  >("posts");

  const userId = useParams().id as string;
  const router = useRouter();

  const successFunc = async () => {
    if (!userId) {
      return router.push("/");
    }

    const response = await getUserByIdApi(
      userId,
      "includePosts=1&includeReposts=1&includeBookmarks=1&includeLikes=1&includeComments=1",
    );
    if (response?.data && !response?.error) {
      setUserState(response.data);
    }
  };

  const { isLoadingState, meSessionState } = useAuthentication(successFunc);

  useEffect(() => {
    setPostsState([]);

    if (userState && activeMenu === "posts") {
      (async () => {
        for (const post of userState.posts!) {
          const postResponse = await getPostByIdApi(
            post!.id!,
            "includeUser=1&includeReposts=1&includeBookmarks=1&includeComments=1&includeLikes=1",
          );

          if (postResponse?.data && !postResponse?.error) {
            setPostsState((prev) => [...prev, postResponse!.data!]);
          }
        }
      })();

      return;
    }

    if (userState && activeMenu === "reposts" && userState.reposts) {
      (async () => {
        for (const repost of userState.reposts!) {
          const postResponse = await getPostByIdApi(
            repost.post!.id!,
            "includeUser=1&includeReposts=1&includeBookmarks=1&includeComments=1&includeLikes=1",
          );

          if (postResponse?.data && !postResponse?.error) {
            setPostsState((prev) => [...prev, postResponse!.data!]);
          }
        }
      })();

      return;
    }

    if (userState && activeMenu === "bookmarks" && userState.bookmarks) {
      (async () => {
        for (const repost of userState.bookmarks!) {
          const postResponse = await getPostByIdApi(
            repost.post!.id!,
            "includeUser=1&includeReposts=1&includeBookmarks=1&includeComments=1&includeLikes=1",
          );

          if (postResponse?.data && !postResponse?.error) {
            setPostsState((prev) => [...prev, postResponse!.data!]);
          }
        }
      })();

      return;
    }
  }, [activeMenu, setPostsState, userState]);

  if (isLoadingState) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <Wrapper width="medium">
        <ProfileCard user={userState!} />
        <div className="w-full flex gap-4 justify-center items-center bg-primary p-4 rounded-md">
          <button
            className={`w-full p-1 ${activeMenu === "posts" ? "bg-text font-semibold" : "bg-text/80 font-normal"} text-primary cursor-pointer hover:bg-text hover:font-semibold text-sm rounded-md `}
            onClick={() => {
              setActiveMenu("posts");
            }}
          >
            {userState?.fullname}
            {"'"}s Posts
          </button>
          <button
            className={`w-full p-1 ${activeMenu === "reposts" ? "bg-text font-semibold" : "bg-text/80 font-normal"} text-primary cursor-pointer hover:bg-text hover:font-semibold text-sm rounded-md `}
            onClick={() => {
              setActiveMenu("reposts");
            }}
          >
            {userState?.fullname}
            {"'"}s Repost
          </button>
          {meSessionState.me?.id === userId && (
            <button
              className={`w-full p-1 ${activeMenu === "bookmarks" ? "bg-text font-semibold" : "bg-text/80 font-normal"} text-primary cursor-pointer hover:bg-text hover:font-semibold text-sm rounded-md `}
              onClick={() => {
                setActiveMenu("bookmarks");
              }}
            >
              {userState?.fullname}
              {"'"}s Bookmarks
            </button>
          )}
        </div>
        <PostLists postLists={postsState || []} />
      </Wrapper>
    </>
  );
};

export default ProfilePage;
