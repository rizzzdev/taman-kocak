import { BookmarkEntity } from "../bookmark/bookmarkEntity";
import { CommentEntity } from "../comment/commentEntity";
import { LikeEntity } from "../like/likeEntity";
import { PostEntity } from "../post/postEntity";
import { RepostEntity } from "../repost/repostEntity";
import { SessionEntity } from "../session/sessionEntity";

export interface UserEntity {
  id: string;
  fullname: string;
  pictureUrl: string | null;
  username: string;
  password?: string;
  role: "USER";
  sessions?: SessionEntity[];
  posts?: PostEntity[];
  likes?: LikeEntity[];
  comments?: CommentEntity[];
  reposts?: RepostEntity[];
  bookmarks?: BookmarkEntity[];
  createdAt: Date;
  lastUpdatedAt: Date | null;
  deletedAt: Date;
}
