import { Container, Flex, Group, GroupProps } from "@mantine/core";
import React from "react";

type HeaderLayoutProps = {
  children: React.ReactNode;
};

type HeaderBoxProps = GroupProps & {
  children: React.ReactNode;
};

function HeaderLayout({ children }: HeaderLayoutProps) {
  return (
    <header>
      <Container strategy="grid">
        <Flex justify="space-between" align="center" py={24}>
          {children}
        </Flex>
      </Container>
    </header>
  );
}

function HeaderBox({ children, ...props }: HeaderBoxProps) {
  return (
    <Group align="center" {...props}>
      {children}
    </Group>
  );
}

HeaderLayout.Left = HeaderBox;
HeaderLayout.Center = HeaderBox;
HeaderLayout.Right = HeaderBox;

export default HeaderLayout;
