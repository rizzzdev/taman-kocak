import { PostEntity } from "@/shared/domain/post/postEntity";
import { atom } from "jotai";

export const postsStateAtom = atom<PostEntity[]>([]);

export const postStateAtom = atom<PostEntity | null>(null);
