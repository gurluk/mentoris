import { Group } from "@mantine/core";

import HeaderLayout from "./HeaderLayout";
import UserMenu from "./UserMenu";
import AppLogo from "@/components/AppLogo";
import LoginButton from "@/features/auth/components/LoginButton";
import ChatButton from "@/features/chat/components/ChatButton";
import NotificationsButton from "@/features/notifications/components/NotificationsButton";
import BecomeTutorButton from "@/features/onboarding/components/BecomeTutorButton";
import { Session } from "@/lib/auth-client";

type HeaderProps = {
  session: Session;
};

export default async function Header({ session }: HeaderProps) {
  return (
    <HeaderLayout>
      <HeaderLayout.Left>
        <AppLogo />
      </HeaderLayout.Left>

      <HeaderLayout.Center>
        <></>
      </HeaderLayout.Center>

      <HeaderLayout.Right>
        {session ? (
          <>
            <Group visibleFrom="md" justify="space-between" gap={14}>
              <BecomeTutorButton />
              <ChatButton />
              <NotificationsButton />
              <UserMenu session={session} />
            </Group>
          </>
        ) : (
          <LoginButton />
        )}
      </HeaderLayout.Right>
    </HeaderLayout>
  );
}
