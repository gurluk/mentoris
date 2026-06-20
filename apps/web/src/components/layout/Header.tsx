import { Container, Flex, Text } from "@mantine/core";

import { Session } from "@/lib/auth-client";
import { httpServer } from "@/lib/http/http-server";
import LoginButton from "../LoginButton";

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
          <LoginButton session={session} />
        </Flex>
      </Container>
    </header>
  );
}
