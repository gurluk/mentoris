"use client";

import { ActionIcon, Box, Container, Flex, Group } from "@mantine/core";
import { User } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

export default function Header({ email }: { email: string }) {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--mantine-color-gray-2)",
      }}
    >
      <Box>
        <Container>
          <Flex justify="space-between" align="center" py={22}>
            {/* LEFT SECTION */}
            <Group fw={700}>
              <Box>LOGO</Box>
            </Group>
            {/* MIDDLE SECTION */}
            {/* <Group></Group> */}
            {/* RIGHT SECTION */}
            <Group gap="md">
              {email ?? "Nemama mail nisam ulogiran"}
              <ActionIcon
                href="/login"
                component={Link}
                c={"dark"}
                variant="transparent"
              >
                <User strokeWidth={1.4} size={24} />
              </ActionIcon>
            </Group>
          </Flex>
        </Container>
      </Box>
    </header>
  );
}
