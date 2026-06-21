"use client";

import { Anchor, Breadcrumbs, Text } from "@mantine/core";
import Link from "next/link";

export default function AppBreadcrumbs() {
  const items = [
    { title: "Početna", href: "/" },
    { title: "Moj Profil", href: "/hooks" },
  ].map((item) => (
    <Anchor component={Link} key={item.href} href={item.href}>
      <Text fz={"sm"}>{item.title}</Text>
    </Anchor>
  ));

  return <Breadcrumbs py={16}>{items}</Breadcrumbs>;
}
