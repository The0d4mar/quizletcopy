
import SideBar from "@/components/sideBar/SideBar";
import "./globals.css";
import Header from "@/components/Header/Header";
import { AppProvider } from "./provider/AppProvider";
import { ReduxProvider } from "./provider/ReduxProvider";
import AddFolder from "@/components/ui/AddFolder/AddFolder";



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
        <ReduxProvider>
            <>
              <Header />

              <main className="flex gap-15 relative w-full px-6">
                <SideBar />

                <div className="flex-1 min-w-0">
                  <AddFolder/>
                  {children}
                </div>
              </main>
            </>
        </ReduxProvider>
      </body>
    </html>
  );
}
