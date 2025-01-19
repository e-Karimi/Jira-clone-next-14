import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";

export const Sidebar = () => {
  return (
    <aside className="h-full w-full p-4 bg-neutral-100 ">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={164} height={48} priority className="w-[164px] h-12" />
      </Link>
      <DottedSeparator className="my-4" />
      <Navigation />
    </aside>
  );
};
