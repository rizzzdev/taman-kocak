import { PostEntity } from "@/shared/domain/post/postEntity";
import PostCard from "./PostCard";
import { UserEntity } from "@/shared/domain/user/userEntity";

interface PostListsProps {
  postLists: PostEntity[];
  user?: UserEntity | null;
  isTrendingPage?: boolean;
}

const PostLists = (props: PostListsProps) => {
  const { postLists, user, isTrendingPage } = props;

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      {postLists.length > 0 &&
        postLists.map((post, index) => {
          if (isTrendingPage) {
            return (
              <PostCard
                key={post.id}
                post={post}
                user={user || post.user!}
                trendingNumber={index + 1}
              />
            );
          }

          return (
            <PostCard key={post.id} post={post} user={user || post.user!} />
          );
        })}
      {postLists.length === 0 && (
        <div className="w-full p-4 flex flex-col justify-center items-center gap-3 bg-primary rounded-md">
          <p className="w-full text-center text-sm text-text">No Post Found!</p>
        </div>
      )}
    </div>
  );
};

export default PostLists;
