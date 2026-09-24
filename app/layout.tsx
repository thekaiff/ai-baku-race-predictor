import type { Metadata } from "next";
import { Big_Shoulders, Inter } from "next/font/google";
// The stylesheet is loaded by Next.js at runtime; TypeScript does not have a
// declaration for CSS side-effect imports in this project.
// @ts-expect-error CSS modules are handled by Next.js, not TypeScript.
import "./globals.css";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Baku GP — model predictions",
  description: "Pre-race Azerbaijan GP driver rankings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning here only ignores mismatches on THIS
          element's own attributes (e.g. bis_skin_checked injected by
          security-extension browser add-ons before React hydrates) — it
          does not suppress hydration warnings anywhere else in the tree */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
