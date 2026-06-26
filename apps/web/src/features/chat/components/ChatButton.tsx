"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { MessageCircleMore } from "lucide-react";

export default function ChatButton() {
  return (
    <Menu position="bottom-end" shadow="md" width={240}>
      <Menu.Target>
        <ActionIcon c={"dark"} variant="transparent" radius="xl">
          <MessageCircleMore size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Nemate novih poruka</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
