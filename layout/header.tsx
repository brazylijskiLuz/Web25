"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Accessibility } from "lucide-react";
import { useAccessibility } from "@/stores/useAccessibility";

export const Header = () => {
  const pathname = usePathname();
  const isAdminPage = pathname === "/admin";
  const { setAccessibilityPanelOpen } = useAccessibility();

  return (
    <header className="flex justify-between py-6">
      <Link
        href="/"
        className="text-2xl font-semibold cursor-pointer hover:opacity-80 transition-opacity no-border flex items-center"
      >
        <Image src="/logo.svg" alt="Logo" width={150} height={150} />
      </Link>
      <nav className="flex items-center gap-4">
        <Button
          variant="ghost"
          // size="icon"
          onClick={() => setAccessibilityPanelOpen(true)}
          aria-label="Otwórz ustawienia dostępności"
          title="Ustawienia dostępności WCAG 2.0"
        >
          Dostępność <Accessibility className="h-5 w-5" />
        </Button>
        <Button variant={"ghost"} asChild>
          <Link href={isAdminPage ? "/" : "/admin"}>
            {isAdminPage ? "Strona główna" : "Panel administratora"}
          </Link>
        </Button>
      </nav>
    </header>
  );
};
