import type { Metadata } from "next";
import { Lexend, DM_Mono } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "Exam Set Akam",
  description: "A spaced repetition quiz for mastering Software Engineering concepts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lexend.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
