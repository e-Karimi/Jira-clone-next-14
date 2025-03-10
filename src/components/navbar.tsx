import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { NavbarTitle } from "./navbar-title";

export const Navbar = () => {
  return (
    <nav className="w-full py-2 px-4 flex items-center justify-between ">
      <NavbarTitle />
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
