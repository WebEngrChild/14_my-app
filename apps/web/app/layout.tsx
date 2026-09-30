import "./globals.css";
import Header from "@/components/layout/header";
import { MemoSearchProvider } from "@/features/todo/context/memo-search-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="grid h-dvh grid-rows-[auto_minmax(0,1fr)]">
        <MemoSearchProvider>
          <Header />

          {children}
        </MemoSearchProvider>
      </body>
    </html>
  );
}
