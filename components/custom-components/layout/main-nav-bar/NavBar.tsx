import Link from "next/link";
import AuthStatus from "./AuthStatus";
import BecomeStudioOwner from "./BecomeStudioOwner";
import Image from "next/image";
import ButtonLink from "../../buttons/ButtonLink";

const NavBar = () => {
  return (
    <div className="flex justify-between bg-white rounded-full px-5 py-1">
      <div className="shrink-0">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width="90" height="50" />
        </Link>
      </div>

      {/* Desktop */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex">
          <ButtonLink href="/explore-studios">探索所有場地</ButtonLink>
          <BecomeStudioOwner />
        </div>

        <AuthStatus />
      </div>

      {/* Mobile */}
    </div>
  );
};

export default NavBar;
