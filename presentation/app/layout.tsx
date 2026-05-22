import type { Metadata } from "next";
import "./globals.css";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PresenterOverlay } from "@/components/presenter/PresenterOverlay";
import { KeyboardShortcuts } from "@/components/presenter/KeyboardShortcuts";

export const metadata: Metadata = {
  title: "Scaling Modern Applications with Redis & Redis for AI",
  description:
    "From caching to vector search — an interactive keynote on Redis for modern app architectures and AI workloads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-redis-ink text-white antialiased">
        <ProgressBar />
        {children}
        <PresenterOverlay />
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
