import { Container } from "@mantine/core";
import { PropsWithChildren } from "react";

import Header from "@/components/layout/Header";
import { authClient } from "@/lib/auth-client";
import { httpServer } from "@/lib/http/http-server";

export type Session = typeof authClient.$Infer.Session;

export default async function Layout({ children }: PropsWithChildren) {
  const session: Session = await httpServer("/auth/get-session");

  return (
    <>
      <Header email={session?.user?.email} />
      <Container strategy="grid">{children}</Container>
    </>
  );
}
