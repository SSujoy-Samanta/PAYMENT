import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "../components/Provider";
import { AppBar } from "../components/Appbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "SuPay",
  description: "Make secure and seamless payments with us.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white flex flex-col min-h-screen overflow-x-hidden `}
      >
        <Provider>
          <nav><AppBar/></nav>
          <main className="flex-grow flex flex-col h-full w-full">{children}</main>
          <footer>footer</footer>
        </Provider>
      </body>
    </html>
  );
}
