"use client";

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Menu,
  Modal,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient, Session } from "@/lib/auth-client";

type UserMenuProps = {
  session: Session;
};

export default function UserMenu({ session }: UserMenuProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const router = useRouter();
  const user = session.user;
  const email = user.email;

  const avatarText = email[0]?.toUpperCase() ?? "?";
  const displayName = user.name?.trim();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <Menu position="bottom-end" shadow="md" width={240}>
        <Menu.Target>
          <ActionIcon variant="transparent" radius={"xl"}>
            <Avatar radius="xl" size="md">
              {avatarText}
            </Avatar>
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          {/* Header section */}
          <Box px="sm" py={8}>
            <Text size="sm" fw={600} truncate>
              {displayName}
            </Text>
            <Text size="xs" c="gray" truncate>
              {email}
            </Text>
          </Box>

          <Menu.Divider />

          {/* Navigation */}
          <Menu.Item leftSection={<User />} fw={500}>
            Moj profil
          </Menu.Item>

          <Menu.Item leftSection={<Settings />} fw={500}>
            Postavke
          </Menu.Item>

          <Menu.Divider />

          {/* Logout */}
          <Menu.Item
            onClick={open}
            leftSection={<LogOut />}
            color="red"
            fw={500}
          >
            Odjava
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Modal opened={opened} onClose={close} title="Odjava" centered>
        <Text size="sm">
          Jeste li sigurni da se želite odjaviti sa svog računa?
        </Text>

        <Group justify="flex-end" gap={6} mt={22}>
          <Button variant="default" onClick={close}>
            Odustani
          </Button>

          <Button color="red" onClick={handleLogout}>
            Odjavi se
          </Button>
        </Group>
      </Modal>
    </>
  );
}
