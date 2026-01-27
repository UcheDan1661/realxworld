import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "REALX WORLD  REALESTATE- GOD IS OUR STRENGTH",
  description: "RealxWorld seamlessly facilitates connections between sellers and buyers, streamlining the process with ease and affordabilty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
