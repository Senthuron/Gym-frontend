import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gym Mini | Micro-SaaS Gym Management",
  description:
    "Lightweight gym management UI for admins to manage members, classes, attendance, and settings.",
};

import { SocketProvider } from "@/lib/SocketContext";
import { NotificationToast } from "@/components/NotificationToast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <SocketProvider>
          {children}
          <NotificationToast />
        </SocketProvider>
      </body>
    </html>
  );
}

