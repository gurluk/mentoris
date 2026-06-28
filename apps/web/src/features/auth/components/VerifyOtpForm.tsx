"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Box,
  Card,
  Center,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { PencilLine } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";

import ResendOtpButton from "./ResendOtpButton/ResendOtpButton";
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
  const otpError = form.formState.errors.otp?.message;

  useLayoutEffect(() => {
    if (!email) router.replace("/login");
  }, [email, router.replace]);

  const handleSubmit = form.handleSubmit(async ({ otp }) => {
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
        form.setFocus("otp");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  });

  if (!email) return;

  return (
    <Card maw={440}>
      <Stack align="center">
        <Title order={1} fz={26}>
          Potvrda email adrese
        </Title>
        <Stack align="center" gap={0}>
          <Text>Unesite 6-znamenkasti kod poslan na:</Text>
          <Group gap={0}>
            <Text fw={600}>{email}</Text>
            <ActionIcon
              href={`/login?email=${encodeURIComponent(email)}`}
              component={Link}
              c={"teal"}
              size={"input-xs"}
              variant="transparent"
            >
              <PencilLine size={16} />
            </ActionIcon>
          </Group>
        </Stack>
      </Stack>
      <Center>
        <Box>
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
              if (value.length === 6) handleSubmit();
            }}
          />
          {otpError && (
            <Text c="red" fz={13}>
              {otpError}
            </Text>
          )}
        </Box>
      </Center>
      <Stack gap={0} mt={20} align="center">
        <Text span ta={"center"} fz={14}>
          Niste primili kod?
        </Text>
        <ResendOtpButton email={email} isSubmitting={isSubmitting} />
      </Stack>
    </Card>
  );
}
