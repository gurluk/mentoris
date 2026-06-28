import { Box, Center, Container } from "@mantine/core";

import AppLogo from "../AppLogo";
import HeaderTemplate from "../HeaderTemplate";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <Box className="bg-gradient">
      <Container pos={"relative"} mih="100dvh">
        <HeaderTemplate pos={"absolute"}>
          <HeaderTemplate.Left>
            <AppLogo />
          </HeaderTemplate.Left>
        </HeaderTemplate>

        <Center mih="100dvh">{children}</Center>
      </Container>
    </Box>
  );
}
