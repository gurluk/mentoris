"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Center, Stack, Text, Title } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";

import InputPin from "@/components/input/InputPin";
import { authClient } from "@/lib/auth-client";
import { promiseWithMinDelay } from "@/lib/promiseWIthMinDelay";
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
      const otpResult = await promiseWithMinDelay(() =>
        authClient.signIn.emailOtp({
          email: email ?? "",
          otp,
        }),
      );

      const errorMessage = otpResult.error?.message;

      if (errorMessage) {
        form.setError("otp", {
          type: "server",
          message: "Uneseni kod je nevažeći ili istekao",
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
    <Card maw={440}>
      <form onSubmit={onSubmit}>
        <Stack>
          <Title order={1} fz={26}>
            Potvrda email adrese
          </Title>

          <Text fz={14}>
            Poslali smo vam 6-znamenkasti kod na email adresu. Upišite ga u
            polje ispod za nastavak.
          </Text>
        </Stack>
        <Center>
          <InputPin
            size="lg"
            length={6}
            mt={26}
            fw={700}
            style={{ justifyContent: "center" }}
            w={"100%"}
            disabled={isSubmitting}
            mb={6}
            name="otp"
            control={form.control}
            onChange={(value) => {
              form.clearErrors("otp");
              form.setValue("otp", value);
            }}
          />
        </Center>
        {otpError && (
          <Text c="red" fz={13}>
            {otpError}
          </Text>
        )}
        <Button
          loading={isSubmitting}
          disabled={isSubmitting}
          size="lg"
          mt={20}
          fz="md"
          type="submit"
          w={"100%"}
        >
          Potvrdi kod
        </Button>
        <Stack gap={0} mt={20} align="center">
          <Text span ta={"center"} fz={14}>
            Niste primili kod?
          </Text>
          <Button
            p={0}
            fz={14}
            c={"dark"}
            size="compact-sm"
            variant="transparent"
            td={"underline"}
            fw={"bolder"}
          >
            Pošalji ponovno
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
