"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Stack } from "@mantine/core";
import { useForm } from "react-hook-form";

import { defaultValues, schema } from "./loginForm.schema";
import InputPassword from "@/components/ui/InputPassword";
import { InputText } from "@/components/ui/InputText";

export default function LoginForm() {
  const form = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <Card shadow="md" padding="xl" withBorder miw={400}>
      <form onSubmit={onSubmit}>
        <Stack>
          <InputText
            placeholder="Adresa e-pošte"
            name="email"
            control={form.control}
          />
          <InputPassword
            placeholder="Lozinka"
            name="password"
            control={form.control}
          />
          <Button
            className="w-full mt-6"
            variant="solid"
            size="large"
            type="submit"
          >
            Prijava
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
