"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Button,
  Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Menu } from "lucide-react";

import LoginButton from "@/features/auth/components/LoginButton";
import { Session } from "@/lib/auth-client";
import AppLogo from "../AppLogo";
import AvatarMenu from "../AvatarMenu";
import HeaderTemplate from "../HeaderTemplate";

type AppLayoutProps = {
  session: Session;
};

export default function AppLayout({
  children,
  session,
}: React.PropsWithChildren<AppLayoutProps>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      header={{ height: 76 }}
    >
      <AppShellHeader>
        <Container h={"100%"}>
          <HeaderTemplate>
            <HeaderTemplate.Left>
              <Button
                c={"dark"}
                p={0}
                onClick={toggle}
                hiddenFrom="sm"
                variant="transparent"
              >
                <Menu />
              </Button>
              <AppLogo />
            </HeaderTemplate.Left>
            <HeaderTemplate.Right
              visibleFrom="sm"
              justify="space-between"
              gap={14}
            >
              {session ? (
                <>
                  {/* <BecomeTutorButton /> */}
                  {/* <ChatButton /> */}
                  {/* <NotificationsButton /> */}
                  <AvatarMenu session={session} />
                </>
              ) : (
                <LoginButton />
              )}
            </HeaderTemplate.Right>
          </HeaderTemplate>
        </Container>
      </AppShellHeader>
      <AppShellNavbar>
        Navbar is collapsed on mobile at sm breakpoint. At that point it is no
        longer offset by padding in the main element and it takes the full width
        of the screen when opened.
      </AppShellNavbar>

      <AppShellMain>
        <Container>{children}</Container>
      </AppShellMain>
    </AppShell>
  );
}
