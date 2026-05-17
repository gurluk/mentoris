import { Center } from "@mantine/core";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Center w="100%" mih="100vh" className="flex-col">
      {children}
    </Center>
  );
}
