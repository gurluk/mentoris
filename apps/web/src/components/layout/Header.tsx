"use client";

import { ActionIcon, Box, Container, Flex, Group } from "@mantine/core";
import { User } from "lucide-react";
import Link from "next/link";

export default function Header() {
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
              {/* <BorderAnimate
                duration={3.5}
                colorFrom="teal"
                size="sm"
                colorTo="violet"
              >
                <Button fz="md" fw={500} size="compact-lg" variant="default">
                  Objavi oglas
                </Button>
              </BorderAnimate> */}
              <ActionIcon
                href="/auth"
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
