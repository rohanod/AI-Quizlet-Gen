import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-pdf-support.vercel.app"),
  title: "AI Flashcard Generator",
  description: "Generate flashcards quickly with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className} h-full`}>
      <body className="min-h-screen bg-gradient-to-b from-background to-background/90">
        <ThemeProvider attribute="class" enableSystem>
          <Toaster position="top-center" richColors />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
