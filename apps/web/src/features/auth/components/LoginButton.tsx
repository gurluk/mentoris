"use client";

import { Button } from "@mantine/core";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Button size="sm" href="/login" component={Link} leftSection={<LogIn />}>
      Prijava
    </Button>
  );
}
