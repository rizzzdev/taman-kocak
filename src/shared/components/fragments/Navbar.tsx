import { useAtomValue } from "jotai";
import Logo from "../ui/Logo";
import Menu from "../ui/Menu";
import { meSessionStateAtom } from "@/shared/stores/meSessionStore";

const Navbar = () => {
  const meSessionState = useAtomValue(meSessionStateAtom);
  const { session } = meSessionState;

  return (
    <header
      className={`w-full h-28 md:h-15 p-2 md:p-4 flex flex-col md:flex-row ${session?.isLogin ? "justify-center" : "justify-start"} items-center gap-2 md:gap-4  bg-primary fixed top-0 left-0 border-b border-text shadow-sm shadow-text z-99`}
    >
      <Logo />
      <Menu />
    </header>
  );
};

export default Navbar;
