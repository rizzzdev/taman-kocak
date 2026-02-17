import { atom } from "jotai";

export const isLoadingStateAtom = atom(true);

const Loading = () => {
  return (
    <div
      className="w-full h-screen flex flex-col justify-center items-center fixed top-0 left-0 z-50 bg-text gap-2
    "
    >
      <div className="loader"></div>
      <p className="w-full text-center font-semibold">Loading ...</p>
    </div>
  );
};

export default Loading;
