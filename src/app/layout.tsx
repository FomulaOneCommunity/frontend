import { ReactNode } from "react";
import "@/styles/tailwind.css";

type RootLayoutProps = {
    readonly children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className="h-dvh overflow-hidden">
        <body className="h-full overflow-hidden">
        {children}
        </body>
        </html>
    );
}