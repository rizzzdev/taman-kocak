import { CommentEntity } from "@/shared/domain/comment/commentEntity";
import { atom } from "jotai";

export const commentsStateAtom = atom<CommentEntity[]>([]);
