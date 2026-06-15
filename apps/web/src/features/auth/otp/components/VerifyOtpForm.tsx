"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Stack, Text, Title } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
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

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const onSubmit = form.handleSubmit(async ({ otp }) => {
    await authClient.signIn.emailOtp(
      { email: email ?? "", otp },
      {
        onSuccess: () => router.push("/"),
        // TODO toast?
        onError: (ctx) => console.log(ctx.error),
      },
    );
  });

  return (
    <Card padding="xl" withBorder shadow="lg" w={"100%"} maw={440}>
      <form onSubmit={onSubmit}>
        <Stack>
          <Stack align="center" mb={16}>
            <Title order={1} fz={26}>
              Potvrdite svoju email adresu
            </Title>
            <Stack gap={2} align="center">
              <Text fz={14} c="dimmed" ta="center">
                Poslali smo 6-znamenkasti kod na
              </Text>

              <Text
                fw={600}
                ta="center"
                style={{
                  overflowWrap: "anywhere",
                }}
              >
                {email}
              </Text>
            </Stack>
          </Stack>
          <Stack align="center" mb={24}>
            <InputPin
              w={"100%"}
              size="lg"
              length={6}
              name="otp"
              control={form.control}
            />
            <Button size="lg" fz="md" type="submit" w={"100%"}>
              Potvrdi kod
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
}
