"use client";

import { ActionIcon } from "@mantine/core";
import { User } from "lucide-react";
import Link from "next/link";

export default function LoginButton() {
  return (
    <ActionIcon href="/login" component={Link} c={"dark"} variant="transparent">
      <User strokeWidth={1.4} size={24} />
    </ActionIcon>
  );
}
