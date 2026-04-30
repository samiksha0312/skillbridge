import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: any) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}