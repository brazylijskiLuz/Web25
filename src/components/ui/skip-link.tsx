"use client";

import React from "react";
import Link from "next/link";

export const SkipLink: React.FC = () => {
  return (
    <Link href="#main-content" className="skip-link">
      Przejdź do głównej treści
    </Link>
  );
};
