"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const isAdminPage = pathname === "/admin";

  return (
    <header className="flex justify-between py-6">
      <Link
        href="/"
        className="text-2xl font-semibold cursor-pointer hover:opacity-80 transition-opacity"
      >
        Symulator <span className="text-primary">Emerytalny</span>
      </Link>
      <nav>
        <Button variant={"outline"} asChild>
          <Link href={isAdminPage ? "/" : "/admin"}>
            {isAdminPage ? "Strona główna" : "Panel administratora"}
          </Link>
        </Button>
      </nav>
    </header>
  );
};
