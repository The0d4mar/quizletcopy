
import SideBar from "@/components/sideBar/SideBar";
import "./globals.css";
import Header from "@/components/Header/Header";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-w-screen mb-5">
        <Header/>
        <main className="flex gap-15 relative w-screen px-6">
          <SideBar/>
          {children}
        </main>
      </body>
    </html>
  );
}
