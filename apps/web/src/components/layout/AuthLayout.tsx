import { Center } from "@mantine/core";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <Center mih={"100dvh"} className="bg-gradient">
      {children}
    </Center>
  );
}
