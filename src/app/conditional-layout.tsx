"use client";

import { usePathname } from "next/navigation";
import { AvatarBackground } from "../../layout/avatar-background";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname === "/admin";

  if (isAdminPage) {
    return (
      <main id="main-content" role="main" className="w-full">
        {children}
      </main>
    );
  }

  return (
    <AvatarBackground circlePosition="middle" assistant="hand-raised">
      <main id="main-content" role="main" className="w-full">
        {children}
      </main>
    </AvatarBackground>
  );
}
