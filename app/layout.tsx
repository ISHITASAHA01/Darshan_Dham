import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/i18n/LanguageContext";
import ClearGoogleTranslate from "@/components/ClearGoogleTranslate";
import PageLoader from "@/components/PageLoader";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "DARSHAN DHAM | Explore Every Temple in India",
  description:
    "Discover all Indian temples with their real location, history, timings and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${poppins.variable} font-sans antialiased`}>
        <PageLoader>
          <ClearGoogleTranslate />
          <LanguageProvider>
            <Navbar />
            {children}
            <Footer />
          </LanguageProvider>
        </PageLoader>
      </body>
    </html>
  );
}