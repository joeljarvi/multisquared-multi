import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { CaseProvider } from "./context/CaseContext";
import "./globals.css";
import { Toaster } from "sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MULTI2",
  description: "what is 1 + 1 ?",
};

const monument = localFont({
  src: "./MonumentGrotesk-Regular.otf",
  variable: "--font-monument",
});

const monumentMedium = localFont({
  src: "./MonumentGrotesk-Medium.otf",
  variable: "--font-monumentMedium",
});

const monumentBold = localFont({
  src: "./MonumentGrotesk-Bold.otf",
  variable: "--font-monumentBold",
});

const monumentMono = localFont({
  src: "./MonumentGrotesk-Mono.otf",
  variable: "--font-monumentMono",
});

const pixelCode = localFont({
  src: "./font/PixelCode.ttf",
  variable: "--font-pixelCode",
});

const pixelCodeThin = localFont({
  src: "./font/PixelCode-Thin.ttf",
  variable: "--font-pixelCodeThin",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${monument.variable} ${monumentMedium.variable} ${monumentBold.variable} ${monumentMono.variable} ${pixelCode.variable} ${pixelCodeThin.variable} antialiased`}
      >
        <CaseProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </CaseProvider>
      </body>
    </html>
  );
}
