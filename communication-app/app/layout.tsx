import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const font = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "Communication App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-[#fcfcfc] dark:bg-[#222429]")}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="app-theme">
            <SocketProvider>
              <ModalProvider />
              
              <QueryProvider>
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
