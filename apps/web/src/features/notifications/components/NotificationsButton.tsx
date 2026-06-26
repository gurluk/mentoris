"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { Bell } from "lucide-react";

export default function NotificationsButton() {
  return (
    <Menu position="bottom-end" shadow="md" width={240}>
      <Menu.Target>
        <ActionIcon c={"dark"} variant="transparent" radius="xl">
          <Bell size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Nemate novih notifikacija</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
