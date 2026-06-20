"use client";

import { ActionIcon, Avatar } from "@mantine/core";
import { User } from "lucide-react";
import Link from "next/link";

import { Session } from "@/lib/auth-client";

type LoginButtonProps = {
  session: Session;
};

export default function LoginButton({ session }: LoginButtonProps) {
  if (session) {
    return (
      <ActionIcon c={"dark"} variant="transparent">
        <Avatar variant="transparent" />
      </ActionIcon>
    );
  }
  return (
    <ActionIcon href="/login" component={Link} c={"dark"} variant="transparent">
      <User strokeWidth={1.4} size={24} />
    </ActionIcon>
  );
}
