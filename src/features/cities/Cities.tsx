"use client";

import { Button, Stack } from "@mantine/core";

import { getCities } from "./cities.query";

export default function Cities() {
  const { data, error, isLoading } = getCities();
  console.log(isLoading);

  return (
    <Stack>
      {data?.data?.map((city: any) => {
        return (
          <Button size="xl" key={city.label}>
            {city.label}
          </Button>
        );
      })}
    </Stack>
  );
}
