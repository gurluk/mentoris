import RootLayout from "@/components/layout/RootLayout";

export default function RootPageLayout({ children }: React.PropsWithChildren) {
  return <RootLayout>{children}</RootLayout>;
}
