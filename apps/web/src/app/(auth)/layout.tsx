import { Center } from "@mantine/core";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <Center
      mih={"100dvh"}
      style={{
        background: `
    radial-gradient(circle at 80% 20%, rgba(94, 234, 212, 0.05), transparent 40%),
    radial-gradient(circle at 15% 85%, rgba(191, 219, 254, 0.05), transparent 45%),
    linear-gradient(135deg, #FFFFFF 0%, #F8FCFC 55%, #F2FBFA 100%)
  `,
      }}
    >
      {children}
    </Center>
  );
}
