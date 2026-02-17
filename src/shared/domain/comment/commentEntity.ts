import { PostEntity } from "../post/postEntity.js";
import { UserEntity } from "../user/userEntity.js";

export interface CommentEntity {
  id: string;
  text: string;
  post?: PostEntity;
  user?: UserEntity;
  createdAt: Date;
  lastUpdatedAt: Date | null;
  deletedAt: Date;
}
