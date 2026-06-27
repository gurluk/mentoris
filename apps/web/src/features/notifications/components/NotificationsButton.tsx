"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { Bell } from "lucide-react";

export default function NotificationsButton() {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon c={"dark"} variant="transparent" radius="xl">
          <Bell />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Nemate novih notifikacija</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
