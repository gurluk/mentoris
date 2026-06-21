"use client";

import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";

import { getQueryClient } from "@/lib/tanstack/query-client";
import IconProvider from "@/providers/IconProvider";
import { mantineTheme } from "@/styles/mantine-theme";

export function Providers({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <MantineProvider forceColorScheme="light" theme={mantineTheme}>
        <IconProvider>{children}</IconProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
