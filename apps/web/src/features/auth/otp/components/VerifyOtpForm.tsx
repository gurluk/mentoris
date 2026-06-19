"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Center, Stack, Text, Title } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";

import InputPin from "@/components/input/InputPin";
import { authClient } from "@/lib/auth-client";
import {
  verifyOtpDefaults,
  verifyOtpSchema,
} from "../schema/verify-otp-form.schema";

export default function VerifyOtpForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: verifyOtpDefaults,
    resolver: zodResolver(verifyOtpSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useLayoutEffect(() => {
    if (!email) router.replace("/login");
  }, [email, router.replace]);

  const onSubmit = form.handleSubmit(async ({ otp }) => {
    try {
      const [otpResult] = await Promise.all([
        authClient.signIn.emailOtp({
          email: email ?? "",
          otp,
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      const errorMessage = otpResult.error?.message;

      if (errorMessage) {
        form.setError("otp", {
          type: "server",
          message: "Neispravan kod",
        });
        return;
      }

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  });

  const otpError = form.formState.errors.otp?.message;

  if (!email) return;

  return (
    <Card padding="xl" withBorder shadow="lg" w={"100%"} maw={440}>
      <form onSubmit={onSubmit}>
        <Stack>
          <Stack>
            <Title order={1} fz={26}>
              Potvrdite svoju email adresu
            </Title>

            <Text fz={14} c="dimmed">
              Poslali smo vam 6-znamenkasti kod za potvrdu email adrese. Upišite
              ga u polje ispod za nastavak.
            </Text>
          </Stack>
          <Stack align="center">
            <Center>
              <InputPin
                w={"100%"}
                size="lg"
                length={6}
                my={14}
                name="otp"
                control={form.control}
                onChange={(value) => {
                  form.clearErrors("otp");
                  form.setValue("otp", value);
                }}
              />
            </Center>
            {otpError && (
              <Text c="red" size="sm">
                {otpError}
              </Text>
            )}
            <Button
              loading={isSubmitting}
              disabled={isSubmitting}
              size="lg"
              fz="md"
              type="submit"
              w={"100%"}
            >
              {otpError ? "Pokušaj ponovno" : "Potvrdi kod"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
}
