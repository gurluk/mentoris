import { PropsWithChildren } from "react";

import AppContainer from "@/components/layout/AppContainer";
import Header from "@/components/layout/Header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <AppContainer>{children}</AppContainer>
    </>
  );
}
