"use client";

import { LucideProvider } from "lucide-react";
import { PropsWithChildren } from "react";

export default function IconProvider({ children }: PropsWithChildren) {
  return (
    <LucideProvider size={20} strokeWidth={1.6}>
      {children}
    </LucideProvider>
  );
}
