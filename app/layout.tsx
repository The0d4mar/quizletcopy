import AppShell from "@/components/AppShell";
import QueryProvider from "@/features/app/QueryProvider";
import { ChildrenProps } from "@/types/types.type";
import { ReduxProvider } from "./provider/ReduxProvider";
import "./globals.css";

const RootLayout = ({ children }: Readonly<ChildrenProps>) => {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="w-full mb-5">
        <QueryProvider>
          <ReduxProvider>
            <AppShell>{children}</AppShell>
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;