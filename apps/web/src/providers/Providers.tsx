"use client";

import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LucideProvider } from "lucide-react";
import { PropsWithChildren } from "react";

import { getQueryClient } from "@/lib/tanstack/query-client";
import { mantineTheme } from "@/styles/mantine-theme";

export function Providers({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <LucideProvider size={22} strokeWidth={1.8}>
        <MantineProvider forceColorScheme="light" theme={mantineTheme}>
          {children}
        </MantineProvider>
      </LucideProvider>
    </QueryClientProvider>
  );
}
