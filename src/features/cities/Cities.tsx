"use client";

import { Avatar, Card, SimpleGrid, Title } from "@mantine/core";

import { getCities } from "./cities.query";

// import { getCities } from "./cities.query";

export default function Cities() {
  const { data, error, isLoading } = getCities();
  console.log("🚀 ~ Cities ~ data:", data);

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, lg: 4 }} mt={50}>
      <Card padding={"md"} withBorder>
        <Avatar color="cyan" radius="xl">
          MK
        </Avatar>
        <Title mt={5} order={4}>
          Luka Gurdulic
        </Title>
      </Card>
    </SimpleGrid>
  );
}
