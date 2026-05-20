"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Divider, Stack, TextInput, Title } from "@mantine/core";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { defaultValues, schema } from "./loginForm.schema";
import InputText from "@/components/input/InputText";

export default function LoginForm() {
  const form = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <Card padding="xl" withBorder shadow="lg" w={"100%"} maw={500}>
      <form onSubmit={onSubmit}>
        <Stack>
          <Stack align="center" mb={16}>
            <Title order={2}>Dobrodošli</Title>
            <Title order={6} fw={400}>
              Prijavite se ili izradite račun u nekoliko sekundi.
            </Title>
          </Stack>
          <InputText
            label="E-mail adresa"
            name="email"
            withAsterisk
            control={form.control}
          />
          <Button size="lg" fz="md" type="submit">
            Nastavi
          </Button>
          <Divider py={10} label="ili" />
          <Stack gap={"sm"}>
            <Button
              size="lg"
              fz={"sm"}
              variant="default"
              leftSection={
                <Image
                  src="/icons/google-icon.svg"
                  alt="Google"
                  width={18}
                  height={18}
                />
              }
            >
              Nastavi s Google
            </Button>
            <Button
              size="lg"
              fz={"sm"}
              variant="default"
              leftSection={
                <Image
                  src="/icons/facebook-icon.svg"
                  alt="Google"
                  width={18}
                  height={18}
                />
              }
            >
              Nastavi s Facebookom
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
}
