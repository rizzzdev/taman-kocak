import { UserEntity } from "@/shared/domain/user/userEntity";
import { atom } from "jotai";

export const userStateAtom = atom<UserEntity | null>(null);
