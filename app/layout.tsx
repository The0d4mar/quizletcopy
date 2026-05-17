
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
      <body className="w-full mb-5">
        <Header/>
        <main className="flex gap-15 relative w-full px-6">
          <SideBar/>
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
