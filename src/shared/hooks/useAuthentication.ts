"use client";

import { jwtDecode } from "jwt-decode";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { postAccessTokenApi } from "../api/access-token/accessTokenApi";
import { isLoadingStateAtom } from "../components/ui/Loading";
import { meSessionStateAtom } from "../stores/meSessionStore";
import { getSessionByIdApi } from "../api/session/sessionApi";
import { commentsStateAtom } from "../stores/comment/commentStore";
import { postsStateAtom, postStateAtom } from "../stores/post/postStore";
import { userStateAtom } from "../stores/user/userStore";

const accessTokenChecker = async (
  ifSuccessFunc: () => void,
  ifFailureFunc: () => void,
) => {
  let accessToken = localStorage.getItem("accessToken") ?? "";
  let exp;
  const now = Date.now();

  try {
    const decoded = jwtDecode(accessToken);
    exp = decoded.exp;
    if (now > exp! * 1000) {
      // accessToken expired
      const response = await postAccessTokenApi();
      accessToken = response!.data || "";
      localStorage.setItem("accessToken", accessToken);
    }
    if (accessToken === "") {
      // accessToken cannot be update cause user must login again
      ifFailureFunc();
      return;
    }
    // token valid
    ifSuccessFunc();
  } catch {
    // accessToken invalid
    const response = await postAccessTokenApi();
    accessToken = response!.data || "";
    localStorage.setItem("accessToken", accessToken);
    if (accessToken === "") {
      // accessToken cannot be update cause user must login again
      ifFailureFunc();
      return;
    }
    // token valid
    ifSuccessFunc();
  }
};

export const useAuthentication = (successFunc: () => void = () => {}) => {
  const [isLoadingState, setIsLoadingState] = useAtom(isLoadingStateAtom);
  const [meSessionState, setMeSessionState] = useAtom(meSessionStateAtom);
  const isTokenCheckFinishRef = useRef(false);
  const pathname = usePathname();
  const isAuthRef = useRef(false);

  const setCommentsState = useSetAtom(commentsStateAtom);
  const setPostState = useSetAtom(postStateAtom);
  const setPostsState = useSetAtom(postsStateAtom);
  const setUserState = useSetAtom(userStateAtom);

  const handleMeSessionState = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    const { sessionId } = jwtDecode(accessToken! ?? "") as {
      sessionId: string;
    };
    const sessionResponse = await getSessionByIdApi(sessionId, "includeUser=1");
    const sessionData = sessionResponse?.data;
    if (sessionData) {
      setMeSessionState((prev) => ({
        ...prev,
        me: sessionData.user,
        session: {
          isLogin: true,
          sessionId,
        },
      }));
    }

    setIsLoadingState(false);
  }, [setMeSessionState, setIsLoadingState]);

  useEffect(() => {
    if (isAuthRef.current) {
      return;
    }

    if (isTokenCheckFinishRef.current) {
      return;
    }

    setUserState(null);
    setCommentsState([]);
    setPostState(null);
    setPostsState([]);
    setMeSessionState({});

    accessTokenChecker(
      async () => {
        handleMeSessionState();
        await successFunc();
      },
      async () => {
        setIsLoadingState(false);
        await successFunc();
      },
    );

    isAuthRef.current = true;
  }, [
    pathname,
    handleMeSessionState,
    setIsLoadingState,
    successFunc,
    setUserState,
    setCommentsState,
    setPostState,
    setPostsState,
    setMeSessionState,
  ]);

  return {
    isLoadingState,
    meSessionState,
  };
};
