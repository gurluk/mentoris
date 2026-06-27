"use client";

import { Anchor } from "@mantine/core";
import Link from "next/link";

export default function AppLogo() {
  return (
    <Anchor
      c={"dark"}
      component={Link}
      href="/"
      underline="never"
      fw={500}
      fz={"xl"}
    >
      mentoris
    </Anchor>
  );
}
