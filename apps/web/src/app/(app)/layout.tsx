import { Container } from "@mantine/core";
import { PropsWithChildren } from "react";

import Header from "@/components/layout/header/Header";
import { Session } from "@/lib/auth-client";
import { httpServer } from "@/lib/http/http-server";

export default async function AppLayout({ children }: PropsWithChildren) {
  const session: Session = await httpServer("/auth/get-session");

  return (
    <>
      <Header session={session} />
      <Container mt={30} strategy="grid">
        {children}
      </Container>
    </>
  );
}
