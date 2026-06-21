import { Container } from "@mantine/core";
import { PropsWithChildren } from "react";

import Header from "@/components/layout/Header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <Container strategy="grid">{children}</Container>
    </>
  );
}
