"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Divider, Stack, Title } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { defaultValues, schema } from "./loginForm.schema";
import { useSendLoginOtp } from "@/api/auth/send-login-otp";
import InputText from "@/components/input/InputText";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const { mutate: sendLoginOtp } = useSendLoginOtp({
    onSuccess(_data, variables) {
      router.push(`/auth/otp?email=${encodeURIComponent(variables.email)}`);
    },
  });

  const onSubmit = form.handleSubmit((formData) => {
    sendLoginOtp({ email: formData.email });
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
