import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { Toaster } from "react-hot-toast";
// putting '@' ,or import alias, in front of a path tells the computer to look in the local directory

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Frumpzone",
  description: "A somewhat modern social media application powered by NEXT.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen">
              {/* min-h-screen means minimum height of screen */}
              <NavBar/>
              <main className="py-8">
                {/* py-8 mean padding in y direction */}
                <div className="max-w-7xl mx-auto px-4">
                  {/* container to center the content */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="hidden lg:block lg:col-span-3"> 
                      <SideBar/>
                    </div>
                    <div className="lg:col-span-9">{children}</div>
                  </div>
                </div>
              </main>
            </div>

          {/* wrapping children in themprovider gives this theme to all the children */}
          <Toaster position="top-center"/>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
