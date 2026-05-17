import { Container } from "@mantine/core";
import { PropsWithChildren } from "react";

export default function AppContainer({ children }: PropsWithChildren) {
  return (
    <Container
      strategy="grid"
      size={1860}
      px={{ base: 12, sm: 16, md: 20, lg: 36 }}
    >
      {children}
    </Container>
  );
}
