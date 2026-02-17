import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href={"/"}
      className="flex flex-col justify-center items-center md:items-start gap-0"
    >
      <h3 className="text-primary text-lg font-bold bg-text rounded-sm">
        Taman Kocak
      </h3>
      <p className="text-text text-xs">situs meme terbaik abad depan!</p>
    </Link>
  );
};

export default Logo;
