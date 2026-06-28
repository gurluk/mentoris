import { Group, GroupProps } from "@mantine/core";
import React from "react";

type HeaderLayoutProps = {
  children: React.ReactNode;
};

type HeaderBoxProps = GroupProps & {
  children: React.ReactNode;
};

function HeaderTemplate({ children }: HeaderLayoutProps) {
  return (
    <Group justify="space-between" align="center" h={"100%"}>
      {children}
    </Group>
  );
}

function HeaderBox({ children, ...props }: HeaderBoxProps) {
  return (
    <Group align="center" {...props}>
      {children}
    </Group>
  );
}

HeaderTemplate.Left = HeaderBox;
HeaderTemplate.Center = HeaderBox;
HeaderTemplate.Right = HeaderBox;

export default HeaderTemplate;
