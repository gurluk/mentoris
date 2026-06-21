import { Container, Flex, Text } from "@mantine/core";

import { Session } from "@/lib/auth-client";
import { httpServer } from "@/lib/http/http-server";
import LoginButton from "../LoginButton";
import UserMenu from "../UserMenu";

export default async function Header() {
  const session: Session = await httpServer("/auth/get-session");

  return (
    <header
      style={{
        borderBottom: "1px solid var(--mantine-color-gray-2)",
      }}
    >
      <Container>
        <Flex justify="space-between" align="center" h={68}>
          <Text fw={600}>LOGO</Text>
          {session ? <UserMenu session={session} /> : <LoginButton />}
        </Flex>
      </Container>
    </header>
  );
}
