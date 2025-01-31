import ButtonLink from "../ButtonLink";
import AuthStatus from "./AuthStatus";
import BecomeStudioOwner from "./BecomeStudioOwner";
import Image from "next/image";
const NavBar = () => {
  return (
    <div className="flex justify-between px-5 py-3 shadow-sm mb-5">
      <Image src="/logo.png" alt="logo" width="90" height="50" />

      <div className="flex items-center gap-3">
        <ButtonLink href="explore-studios">探索所有場地</ButtonLink>
        <BecomeStudioOwner />
        <AuthStatus />
      </div>
    </div>
  );
};

export default NavBar;
