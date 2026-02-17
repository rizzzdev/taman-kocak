import { PostEntity } from "../post/postEntity";
import { UserEntity } from "../user/userEntity";

export interface BookmarkEntity {
  id: string;
  post?: PostEntity;
  user?: UserEntity;
  createdAt: Date;
  lastUpdatedAt: Date | null;
  deletedAt: Date;
}
