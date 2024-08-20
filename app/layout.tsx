// import { ReactNode } from "react";
// import { Inter } from "next/font/google";
// import { Viewport } from "next";
// import PlausibleProvider from "next-plausible";
// import { getSEOTags } from "@/libs/seo";
// import ClientLayout from "@/components/LayoutClient";
// import config from "@/config";
// import "./globals.css";
// import "./prosemirror.css";

// const font = Inter({ subsets: ["latin"] });

// export const viewport: Viewport = {
//   // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
//   width: "device-width",
//   initialScale: 1,
// };

// // This adds default SEO tags to all pages in our app.
// // You can override them in each page passing params to getSOTags() function.
// export const metadata = getSEOTags();

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en"   className={font.className}>
//       {config.domainName && (
//         <head>
//           <PlausibleProvider domain={config.domainName} />
//           <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
//           <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
//           <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
//           <link rel="manifest" href="/site.webmanifest" />
//           <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
//           <meta name="msapplication-TileColor" content="#ffc40d" />
//           <meta name="theme-color" content="#ffffff" />
//         </head>
//       )}
//       <body className="bg-background">
//         {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
//         <ClientLayout>{children}</ClientLayout>
//       </body>
//     </html>
//   );
// }




import { ReactNode } from "react";
import { Viewport } from "next";
import PlausibleProvider from "next-plausible";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";
import "./prosemirror.css";


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {config.domainName && (
        <head>
           <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
          <PlausibleProvider domain={config.domainName} />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#ffc40d" />
          <meta name="theme-color" content="#ffffff" />
        </head>
      )}
      <body className="bg-background font-noto-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

