import { Center } from "@mantine/core";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <Center mih={"100dvh"}>{children}</Center>;
}
