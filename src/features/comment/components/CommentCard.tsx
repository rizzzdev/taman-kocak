import { Timestamp, UserInfo } from "@/features/post/components/PostCard";
import Form from "@/shared/components/ui/Form";
import { CommentEntity } from "@/shared/domain/comment/commentEntity";
import { PostEntity } from "@/shared/domain/post/postEntity";

interface CommentListProps {
  comment: CommentEntity;
}

const CommentList = (props: CommentListProps) => {
  const { comment } = props;

  return (
    <div className="w-full flex flex-col justify-center items-center border border-primary rounded-md gap-1 p-2">
      {comment?.user && (
        <>
          <UserInfo user={comment.user} color="primary" />
          <Timestamp date={String(comment.createdAt)} color="primary" />
        </>
      )}
      <p className="w-full text-sm text-justify mt-2">{comment.text}</p>
    </div>
  );
};

interface CommentsProps {
  comments: CommentEntity[];
}

const Comments = (props: CommentsProps) => {
  const { comments } = props;

  return (
    <div className="w-full flex flex-col justify-center items-center mt-4">
      <h3 className="w-full text-lg font-semibold">
        Comments ({comments.length})
      </h3>
      <div className="w-full flex flex-col justify-center items-center gap-1">
        {comments.length > 0 &&
          comments
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((comment) => {
              return <CommentList key={comment.id} comment={comment} />;
            })}
        {comments.length === 0 && (
          <p className="w-full text-sm text-center mt-2">
            No Comment Found at this post!
          </p>
        )}
      </div>
    </div>
  );
};

interface CommentsCardProps {
  comments: CommentEntity[];
  onSumbitComment?: () => void;
}

const CommentsCard = (props: CommentsCardProps) => {
  const { comments, onSumbitComment } = props;

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2 p-2 bg-text rounded-sm">
      <h3 className="w-full text-lg font-semibold text-primary">
        Post a Comment
      </h3>
      <Form onSubmit={onSumbitComment}>
        <Form.TextArea htmlFor="text" color="primary" minHeight={24} />
        <Form.Button
          useMarginTop
          text="Post a Comment"
          color="primary"
          marginTop="4px"
        />
      </Form>
      <Comments comments={comments || []} />
    </div>
  );
};

export default CommentsCard;
