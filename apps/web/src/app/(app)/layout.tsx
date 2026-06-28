import { PropsWithChildren } from "react";

import AppLayout from "@/components/layout/AppLayout";
import { Session } from "@/lib/auth-client";
import { httpServer } from "@/lib/http/http-server";

export default async function AppPagesLayout({ children }: PropsWithChildren) {
  const session: Session = await httpServer("/auth/get-session");

  return <AppLayout session={session}>{children}</AppLayout>;
}
