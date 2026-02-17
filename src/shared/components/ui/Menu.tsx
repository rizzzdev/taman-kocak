import { deleteSessionById } from "@/shared/api/session/sessionApi";
import { meSessionStateAtom } from "@/shared/stores/meSessionStore";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MenuListProps {
  text: string;
  href?: string;
}

const MenuList = (props: MenuListProps) => {
  const { text, href } = props;

  return (
    <Link
      href={href || "/"}
      className="text-text text-xs hover:font-semibold hover:bg-text hover:text-primary p-2 rounded-md"
    >
      {text}
    </Link>
  );
};
const UserMenu = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const meSessionState = useAtomValue(meSessionStateAtom);
  const { me, session } = meSessionState;
  const imgSrc = me?.pictureUrl
    ? me.pictureUrl.includes("public")
      ? "/api" + me.pictureUrl
      : "/image" + me.pictureUrl
    : "/default-profile-picture.png";

  const handleClickUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    const logoutResponse = await deleteSessionById(session!.sessionId!);

    if (!logoutResponse?.error) {
      window.localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isUserMenuOpen && !isHover) {
      timeout = setTimeout(() => {
        setIsUserMenuOpen(false);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [isUserMenuOpen, isHover]);

  return (
    <div
      className=" text-text flex justify-center items-center gap-1 ml-5  cursor-pointer relative"
      onClick={handleClickUserMenu}
    >
      <Image
        src={imgSrc}
        alt="user-menu"
        width={2000}
        height={2000}
        className="w-8 aspect-square rounded-full border-2 border-text"
      />

      {isUserMenuOpen && (
        <div
          className="w-50  absolute top-12 right-0 bg-primary text-text p-4 cursor-auto rounded-md border border-text shadow-md shadow-text z-99"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div className="w-full flex flex-col justify-center items-center mb-4">
            <Image
              src={imgSrc}
              alt="user-profile-picture"
              width={2000}
              height={2000}
              className="w-15 h-15 rounded-full bg-text p-0.5 mb-2"
            />
            <h3 className="w-full text-center text-md font-semibold">
              {me?.fullname || ""}
            </h3>
            <p className="w-full text-center text-xs ">@{me?.username || ""}</p>
          </div>
          <div className="w-full flex flex-col justify-center items-center gap-1">
            <Link
              className="w-full p-1 bg-text/80 text-primary rounded-sm text-xs text-left hover:font-semibold hover:bg-text cursor-pointer"
              href={`/profile/${me?.id}`}
            >
              Profile
            </Link>
            <Link
              className="w-full p-1 bg-text/80 text-primary rounded-sm text-xs text-left hover:font-semibold hover:bg-text cursor-pointer"
              href={`/account-settings?id=${me?.id}`}
            >
              Account Settings
            </Link>
            <button
              className="w-full p-1 bg-red-500/80 text-text rounded-sm text-xs text-left hover:font-semibold hover:bg-red-500 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Menu = () => {
  const meSessionState = useAtomValue(meSessionStateAtom);
  const { session } = meSessionState;

  return (
    <nav className="w-full md:flex-1 flex justify-around md:justify-end items-center gap-2 md:gap-4">
      <MenuList text="Home" href="/" />
      <MenuList text="Trending" href="/trending" />
      {session?.isLogin && (
        <>
          <MenuList text="Post a Meme" href="/post/create" />
          <UserMenu />
        </>
      )}
      {!session?.isLogin && <MenuList text="Login" href="/login" />}
      {!session?.isLogin && <MenuList text="Register" href="/register" />}
    </nav>
  );
};

export default Menu;
