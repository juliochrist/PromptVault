import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "PromptVault",
    template: "%s | PromptVault",
  },
  description: "Organize, version, improve, and reuse AI prompts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
