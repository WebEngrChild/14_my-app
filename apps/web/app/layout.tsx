import "./globals.css";
import Header from "@/components/layout/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="grid h-dvh grid-rows-[auto_minmax(0,1fr)]">
        <Header />

        {children}
      </body>
    </html>
  );
}
