import { ReactNode } from "react";

interface WrapperProps {
  children?: ReactNode;
  width?: "small" | "medium";
}

const Wrapper = (props: WrapperProps) => {
  const { children, width } = props;

  return (
    <main className="w-full h-[calc(100vh-112px)] md:h-[calc(100vh-60px)] mt-28 md:mt-15 flex justify-center items-start bg-text overflow-y-auto p-2 md:p-4">
      <div
        className={`w-full ${width === "medium" ? "md:w-1/2" : "md:w-2/5"} flex flex-col justify-start items-center gap-2 `}
      >
        {children}
      </div>
    </main>
  );
};

export default Wrapper;
