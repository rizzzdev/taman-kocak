import CommentCard from "@/features/comment/components/CommentCard";
import { postBookmarkApi } from "@/shared/api/bookmark/bookmarkApi";
import { postCommentApi } from "@/shared/api/comment/commentApi";
import { postLikeApi } from "@/shared/api/like/likeApi";
import { getPostByIdApi } from "@/shared/api/post/postApi";
import { postRepostApi } from "@/shared/api/repost/repostApi";
import { formStateAtom } from "@/shared/components/ui/Form";
import { BookmarkEntity } from "@/shared/domain/bookmark/bookmarkEntity";
import { CommentEntity } from "@/shared/domain/comment/commentEntity";
import { LikeEntity } from "@/shared/domain/like/likeEntity";
import { PostEntity } from "@/shared/domain/post/postEntity";
import { RepostEntity } from "@/shared/domain/repost/repostEntity";
import { UserEntity } from "@/shared/domain/user/userEntity";
import { dateParser } from "@/shared/libs/dateParser";
import { localDateNow } from "@/shared/libs/localDateNow";
import { meSessionStateAtom } from "@/shared/stores/meSessionStore";
import {
  BookmarksSimpleIcon,
  ChatCircleTextIcon,
  ClockIcon,
  Icon,
  PaperPlaneTiltIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserInfoProps {
  user: UserEntity;
  color?: "primary" | "text";
}

export const UserInfo = (props: UserInfoProps) => {
  const { user, color } = props;

  return (
    <div className="w-full flex justify-start items-center">
      <Link
        className="flex gap-3 justify-start items-center"
        href={`/profile/${user?.id}`}
      >
        <Image
          src={
            user?.pictureUrl
              ? user.pictureUrl.includes("public")
                ? "/api" + user.pictureUrl
                : "/image" + user.pictureUrl
              : "/default-profile-picture.png"
          }
          alt="user-profile-picture"
          width={2000}
          height={2000}
          className={`w-15 aspect-square object-fill rounded-full   border-2 ${color === "primary" ? "bg-primary border-primary" : "bg-text border-text"}`}
        />
        <div
          className={`w-full flex flex-col justify-center items-start ${color === "primary" ? "text-primary" : "text-text"}`}
        >
          <h3 className="text-md  font-semibold">{user?.fullname || ""}</h3>
          <p className="text-xs ">
            {user?.username ? "@" + user.username : ""}
          </p>
        </div>
      </Link>
    </div>
  );
};

interface TimestampProps {
  date: string;
  color?: "primary" | "text";
}

export const Timestamp = (props: TimestampProps) => {
  const { date, color } = props;
  const { day, month, year, hours, minutes } = dateParser(date);

  return (
    <div className="w-full flex justify-end items-center gap-1">
      <ClockIcon
        size={20}
        weight="bold"
        className={`${color === "primary" ? "text-primary" : "text-text"}`}
      />
      <p
        className={`text-xs ${color === "primary" ? "text-primary" : "text-text"}`}
      >{`${month} ${day}, ${year} @${hours}:${minutes}`}</p>
    </div>
  );
};

interface PostImageProps {
  src: string;
}

const PostImage = (props: PostImageProps) => {
  const { src } = props;

  return (
    <div className="w-full flex justify-center items-center rounded-md bg-text overflow-hidden p-1">
      <Image
        src={src.includes("public") ? `/api${src}` : `/image${src}`}
        // src={`${src}`}
        alt="post-image"
        width={2000}
        height={2000}
        className="w-full object-contain "
        loading="eager"
      />
    </div>
  );
};

interface CallToActionListProps {
  Icon: Icon;
  text: string;
  title?: string;
  weight?: "fill" | "regular";
  onClick?: () => void;
}

const CallToActionList = (props: CallToActionListProps) => {
  const { Icon, text, title, weight, onClick } = props;
  return (
    <div
      className="flex justify-center items-center gap-1 cursor-pointer"
      title={title}
      onClick={onClick}
    >
      <Icon
        size={24}
        weight={weight === "regular" ? "regular" : "fill"}
        className="text-primary"
      />
      <p className="text-xs text-primary font-semibold">{text}</p>
    </div>
  );
};

interface ICommentsState {
  comments: CommentEntity[];
  commentsCount: number;
  isMeCommented: boolean;
}

interface CallToActionProps {
  post: PostEntity;
  commentsState?: ICommentsState;
}

const CallToAction = (props: CallToActionProps) => {
  const { post, commentsState } = props;

  const { me } = useAtomValue(meSessionStateAtom);

  const [postState, setPostState] = useState<PostEntity | null>(post);

  const router = useRouter();

  const [likesState, setLikesState] = useState<{
    likes: LikeEntity[];
    likesCount: number;
    isMeLiked: boolean;
  }>({
    likes: postState?.likes || [],
    likesCount: postState?.likes?.length || 0,
    isMeLiked:
      postState?.likes?.some((like) => like?.user?.id === me?.id) || false,
  });

  const [repostsState, setRepostsState] = useState<{
    reposts: RepostEntity[];
    repostsCount: number;
    isMeReposted: boolean;
  }>({
    reposts: postState?.reposts || [],
    repostsCount: postState?.reposts?.length || 0,
    isMeReposted:
      postState?.reposts?.some((repost) => repost?.user?.id === me?.id) ||
      false,
  });

  const [bookmarksState, setBookmarksState] = useState<{
    bookmarks: BookmarkEntity[];
    bookmarksCount: number;
    isMeBookmarked: boolean;
  }>({
    bookmarks: postState?.bookmarks || [],
    bookmarksCount: postState?.bookmarks?.length || 0,
    isMeBookmarked:
      postState?.bookmarks?.some((bookmark) => bookmark?.user?.id === me?.id) ||
      false,
  });

  const handleLike = async () => {
    if (!me) {
      return router.push("/login");
    }

    const prevLikesState = likesState;

    setLikesState({
      likes: [
        ...likesState.likes,
        {
          id: "tempId",
          user: me!,
          post: postState!,
          createdAt: localDateNow(),
          deletedAt: localDateNow(),
          lastUpdatedAt: localDateNow(),
        },
      ],
      isMeLiked: !likesState.isMeLiked,
      likesCount: likesState.isMeLiked
        ? likesState.likesCount - 1
        : likesState.likesCount + 1,
    });

    const likeResponse = await postLikeApi({
      postId: postState!.id!,
      userId: me!.id!,
    });

    const postResponse =
      !likeResponse?.error &&
      (await getPostByIdApi(
        postState!.id!,
        "includeUser=1&includeReposts=1&includeBookmarks=1&includeComments=1&includeLikes=1",
      ));
    if (postResponse && !postResponse.error) {
      setPostState(postResponse.data);
    }

    if (!likeResponse?.error && postResponse && !postResponse.error) {
      return setLikesState({
        likes: (postResponse && postResponse.data!.likes) || [],
        isMeLiked:
          (postResponse &&
            postResponse.data!.likes?.some(
              (like) => like?.user?.id === me?.id,
            )) ||
          false,
        likesCount: (postResponse && postResponse?.data?.likes?.length) || 0,
      });
    }

    if (likeResponse?.error && postResponse && postResponse.error) {
      return setLikesState(prevLikesState);
    }
  };

  const handleRepost = async () => {
    if (!me) {
      return router.push("/login");
    }

    const prevRepostsState = repostsState;

    setRepostsState({
      reposts: [
        ...repostsState.reposts,
        {
          id: "tempId",
          user: me!,
          post: postState!,
          createdAt: localDateNow(),
          deletedAt: localDateNow(),
          lastUpdatedAt: localDateNow(),
        },
      ],
      isMeReposted: !repostsState.isMeReposted,
      repostsCount: repostsState.isMeReposted
        ? repostsState.repostsCount - 1
        : repostsState.repostsCount + 1,
    });

    const repostResponse = await postRepostApi({
      postId: postState!.id!,
      userId: me!.id!,
    });

    const postResponse =
      !repostResponse?.error &&
      (await getPostByIdApi(
        postState!.id!,
        "includeUser=1&includeReposts=1&includeBookmarks=1&includeComments=1&includeLikes=1",
      ));
    if (postResponse && !postResponse.error) {
      setPostState(postResponse.data);
    }

    if (!repostResponse?.error && postResponse && !postResponse.error) {
      return setRepostsState({
        reposts: (postResponse && postResponse.data!.reposts) || [],
        isMeReposted:
          (postResponse &&
            postResponse.data!.reposts?.some(
              (repost) => repost?.user?.id === me?.id,
            )) ||
          false,
        repostsCount:
          (postResponse && postResponse?.data?.reposts?.length) || 0,
      });
    }

    if (repostResponse?.error && postResponse && postResponse.error) {
      return setRepostsState(prevRepostsState);
    }
  };

  const handleBookmark = async () => {
    if (!me) {
      return router.push("/login");
    }

    const prevBookmarksState = bookmarksState;

    setBookmarksState({
      bookmarks: [
        ...bookmarksState.bookmarks,
        {
          id: "tempId",
          user: me!,
          post: postState!,
          createdAt: localDateNow(),
          deletedAt: localDateNow(),
          lastUpdatedAt: localDateNow(),
        },
      ],
      isMeBookmarked: !bookmarksState.isMeBookmarked,
      bookmarksCount: bookmarksState.isMeBookmarked
        ? bookmarksState.bookmarksCount - 1
        : bookmarksState.bookmarksCount + 1,
    });

    const bookmarkResponse = await postBookmarkApi({
      postId: postState!.id!,
      userId: me!.id!,
    });

    const postResponse =
      !bookmarkResponse?.error &&
      (await getPostByIdApi(
        postState!.id!,
        "includeUser=1&includeReposts=1&includeBookmarks=1&includeComments=1&includeLikes=1",
      ));
    if (postResponse && !postResponse.error) {
      setPostState(postResponse.data);
    }

    if (!bookmarkResponse?.error && postResponse && !postResponse.error) {
      return setBookmarksState({
        bookmarks: (postResponse && postResponse.data!.bookmarks) || [],
        isMeBookmarked:
          (postResponse &&
            postResponse.data!.bookmarks?.some(
              (bookmark) => bookmark?.user?.id === me?.id,
            )) ||
          false,
        bookmarksCount:
          (postResponse && postResponse?.data?.bookmarks?.length) || 0,
      });
    }

    if (bookmarkResponse?.error && postResponse && postResponse.error) {
      return setBookmarksState(prevBookmarksState);
    }
  };

  const handleComment = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <div className="w-full flex justify-around items-center gap-1 p-2 bg-text rounded-sm">
      <CallToActionList
        title="Like count"
        Icon={ThumbsUpIcon}
        weight={likesState.isMeLiked ? "fill" : "regular"}
        text={likesState?.likesCount.toString()}
        onClick={handleLike}
      />
      <CallToActionList
        title="Comment count"
        weight={
          commentsState && commentsState.isMeCommented ? "fill" : "regular"
        }
        Icon={ChatCircleTextIcon}
        text={commentsState?.commentsCount.toString() || "0"}
        onClick={handleComment}
      />
      <CallToActionList
        title="Repost count"
        Icon={PaperPlaneTiltIcon}
        text={repostsState?.repostsCount.toString()}
        weight={repostsState.isMeReposted ? "fill" : "regular"}
        onClick={handleRepost}
      />
      <CallToActionList
        title="Bookmark count"
        Icon={BookmarksSimpleIcon}
        text={bookmarksState?.bookmarksCount.toString()}
        weight={bookmarksState.isMeBookmarked ? "fill" : "regular"}
        onClick={handleBookmark}
      />
    </div>
  );
};

interface PostCardProps {
  post: PostEntity;
  user: UserEntity;
  includeComments?: boolean;
  trendingNumber?: number;
}

const PostCard = (props: PostCardProps) => {
  const { post, user, includeComments, trendingNumber } = props;

  const [formState, setFormState] = useAtom(formStateAtom);
  const { me } = useAtomValue(meSessionStateAtom);
  const [commentsState, setCommentsState] = useState<ICommentsState>({
    comments: post.comments || [],
    commentsCount: post.comments?.length || 0,
    isMeCommented:
      post.comments?.some((comment) => comment.user?.id === me?.id) || false,
  });

  const router = useRouter();

  const handleComment = async () => {
    if (!me) {
      return router.push(`/login`);
    }

    const prevCommentsState = commentsState;
    const prevFormState = formState;

    setCommentsState({
      comments: [
        ...commentsState.comments,
        {
          id: "tempId",
          text: formState["text"] || "",
          createdAt: localDateNow().toISOString(),
          deletedAt: localDateNow().toISOString(),
          lastUpdatedAt: localDateNow().toISOString(),
          post: post,
          user: me,
        },
      ],
      isMeCommented: true,
      commentsCount: commentsState.commentsCount + 1,
    });

    setFormState({});

    const response = await postCommentApi({
      postId: post.id,
      text: formState["text"] || "",
      userId: me!.id!,
    });

    const postResponse =
      !response?.error &&
      (await getPostByIdApi(
        post.id!,
        "includeUser=1&includeReposts=1&includeBookmarks=1&includeComments=1&includeLikes=1",
      ));

    console.log({
      typeof: postResponse && typeof postResponse.data?.createdAt,
      localNow: localDateNow().toISOString(),
      now: new Date().toISOString(),
    });

    if (postResponse && !postResponse.error) {
      return setCommentsState({
        comments: (postResponse && postResponse.data?.comments) || [],
        isMeCommented:
          (postResponse &&
            postResponse.data?.comments?.some(
              (comment) => comment?.user?.id === me?.id,
            )) ||
          false,
        commentsCount:
          (postResponse && postResponse?.data?.comments?.length) || 0,
      });
    }

    if (postResponse && postResponse.error) {
      setFormState(prevFormState);
      return setCommentsState(prevCommentsState);
    }
  };

  return (
    <div className="w-full p-4 flex flex-col justify-center items-center gap-3 bg-primary rounded-md relative">
      <UserInfo user={user} />

      <Timestamp date={String(post.createdAt)} />

      <p className="w-full text-lg text-text">{post.caption}</p>
      {post.imageUrl && <PostImage src={post.imageUrl} />}
      {/* <PostImage src={"/image/1771351862596.png"} /> */}
      <CallToAction post={post} commentsState={commentsState} />
      {includeComments && (
        <CommentCard
          comments={commentsState.comments}
          onSumbitComment={handleComment}
        />
      )}
      {trendingNumber && (
        <p className="p-1 text-sm font-semibold border border-primary bg-text text-primary absolute top-1 right-1 rounded-tr-md">
          Trending #{trendingNumber}
        </p>
      )}
    </div>
  );
};

export default PostCard;
