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
      <body className="min-h-screen bg-bg text-text antialiased">
        <div className="bg-glow bg-glow-top-right" />
        <div className="bg-glow bg-glow-bottom-left" />
        <div className="bg-glow bg-glow-center" />
        <div className="noise-overlay" />
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
