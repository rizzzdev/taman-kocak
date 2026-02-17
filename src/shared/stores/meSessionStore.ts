import { atom } from "jotai";
import { UserEntity } from "../domain/user/userEntity";

interface IMeSessionState {
  me?: UserEntity;
  session?: {
    isLogin: boolean;
    sessionId?: string;
  };
}
export const meSessionStateAtom = atom<IMeSessionState>({
  session: {
    isLogin: false,
  },
});
