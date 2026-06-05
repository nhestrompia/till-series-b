import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Startup 82-0",
  description: "Build the most cursed startup team in tech.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="noise" />
        {children}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
