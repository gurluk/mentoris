"use client";

import { Button, Group, Text } from "@mantine/core";
import { Check } from "lucide-react";
import { useState } from "react";

import classes from "./ResendOtpButton.module.css";
import { promiseWithMinDelay } from "@/lib/promiseWIthMinDelay";
import { sendLoginOtp } from "../../api/auth.service";

type ResendOtpButtonProps = {
  email: string;
  isSubmitting: boolean;
};
export default function ResendOtpButton(props: ResendOtpButtonProps) {
  const { email, isSubmitting } = props;
  const [isLoading, setIsLoading] = useState(false);
  // TODO
  const [isSent, setIsSent] = useState(false);

  const onResend = async () => {
    if (isSubmitting) return;
    setIsLoading(true);

    const { data, error } = await promiseWithMinDelay(() =>
      sendLoginOtp(email),
    );

    if (error) {
      setIsLoading(false);
      // TODO toast or something
      console.error(error);
      return;
    }

    setIsLoading(false);
    setIsSent(true);

    setTimeout(() => {
      setIsSent(false);
    }, 3000);
  };

  return (
    <Button
      className={classes.button}
      p={0}
      loading={isLoading}
      disabled={isSent || isSubmitting}
      onClick={onResend}
      c={"teal"}
      size="compact-sm"
      variant="transparent"
      // td={isSent ? undefined : "underline"}
    >
      <Group gap={2}>
        {isSent ? (
          <>
            <Check size={16} strokeWidth={2} />
            <Text fw={500} fz={14} span>
              Poslali smo novi kod
            </Text>
          </>
        ) : (
          // TODO posalji ponovno za (timer koji setupiras iz konstante kad se submitta login ili kad ponovno posaljes kod resetiras taj tajmer opet)
          <Text fw={500} fz={14} td={"underlined"} span>
            Pošalji ponovno
          </Text>
        )}
      </Group>
    </Button>
  );
}
