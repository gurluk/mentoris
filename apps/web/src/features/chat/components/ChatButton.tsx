"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { MessageCircleMore } from "lucide-react";

export default function ChatButton() {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon c={"dark"} variant="transparent" radius="xl">
          <MessageCircleMore />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Nemate novih poruka</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
