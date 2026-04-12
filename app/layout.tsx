import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product School Portal",
  description: "Secure gateway for Product School enterprise customer assessments and proposals",
  icons: {
    icon: "/icon.png",
  },
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
