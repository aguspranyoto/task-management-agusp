import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Management by Agusp",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div className="min-h-screen flex flex-col justify-between">
          <main className="grow bg-gray-100 py-8">{children}</main>
          <footer className="py-3 shadow-sm" role="footer">
            <div className="max-w-5xl mx-auto justify-center flex items-center  gap-1 text-center text-sm">
              &copy; {new Date().getFullYear()} Task Management by
              <a
                className="text-blue-600"
                href="https://www.linkedin.com/in/aguspranyoto"
                target="_blank"
                rel="noreferrer"
              >
                Agusp
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
