import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PS Assessments Portal",
  description: "Secure gateway for Product School enterprise customer assessments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
