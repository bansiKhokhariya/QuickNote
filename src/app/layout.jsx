
'use client';
import { Inter as FontSans } from "next/font/google";
import { useState, useEffect } from "react";
import "./prosemirror.css";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { magic } from "@/lib/magic";
import { UserContext } from "@/lib/UserContext";
import { useRouter } from 'next/navigation';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}) {
  const router = useRouter();
  const [user, setUser] = useState('');

  useEffect(() => {
    if (magic) {
      setUser({ loading: true });
      magic.user.isLoggedIn().then((isLoggedIn) => {
        if (isLoggedIn) {
          magic.user.getInfo().then((userData) => {
            setUser({ ...userData, loading: false });
          });
        } else {
          setUser({ loading: false });
        }
      });
    }
  }, []);

  return (
    <html lang="en">
      <title>Quicknote</title>
      <meta name="description" content="A brief description of your page or website." />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <UserContext.Provider value={[user, setUser]}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              toastOptions={{
                duration: 3000,
              }}
            />
          </ThemeProvider>
        </UserContext.Provider>
      </body>
    </html>
  );
}
