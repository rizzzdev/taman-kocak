import { BookmarkEntity } from "../bookmark/bookmarkEntity";
import { CommentEntity } from "../comment/commentEntity";
import { LikeEntity } from "../like/likeEntity";
import { RepostEntity } from "../repost/repostEntity";
import { UserEntity } from "../user/userEntity";

export interface PostEntity {
  id: string;
  caption: string;
  imageUrl: string | null;
  trendingScore: number;
  user?: UserEntity;
  likes?: LikeEntity[];
  comments?: CommentEntity[];
  reposts?: RepostEntity[];
  bookmarks?: BookmarkEntity[];
  createdAt: Date;
  lastUpdatedAt: Date | null;
  deletedAt: Date;
}
