import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Balanced UK News",
  description:
    "Compare headlines across UK news outlets — BBC, Guardian, Daily Mail, Independent, and Sky News. Updated every hour.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Balanced UK News",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${geist.variable} min-h-dvh antialiased`}>
        {children}
      </body>
    </html>
  );
}
