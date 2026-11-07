import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Udder Blooder",
  description: "Enter the house. Find your way out.",
  themeColor: "#08090d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
