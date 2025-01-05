import Image from "next/image";
import { AuthLayoutBtn } from "@/features/auth/components/auth-layout-btn";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Image src="/logo.svg" width={152} height={56} alt="logo" className="w-[152px] h-14" priority />
          <AuthLayoutBtn />
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">{children}</div>
      </div>
    </main>
  );
}
