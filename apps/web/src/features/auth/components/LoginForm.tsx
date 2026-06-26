"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Divider, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import InputText from "@/components/input/InputText";
import { sendLoginOtp } from "../api/auth.service";
import {
  LoginValues,
  loginDefaults,
  loginSchema,
} from "../schema/login-form.schema";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: loginDefaults,
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = form.handleSubmit(async ({ email }: LoginValues) => {
    const { error, data } = await sendLoginOtp(email);

    if (error) {
      console.error(error);
      // TODO toast or something
      return;
    }

    if (data) {
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    }
  });

  return (
    <Card mx={14} maw={500}>
      <form onSubmit={onSubmit}>
        <Stack>
          <Stack align="center" mb={16}>
            <Title order={2}>Dobrodošli</Title>
            <Text c="gray" fz={14} fw={400}>
              Prijavite se ili izradite račun u nekoliko sekundi.
            </Text>
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
