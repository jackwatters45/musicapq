import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { TopNav } from "@/components/nav/top-nav";
import { cn } from "@/lib/utils";
import BackgroundGrid from "../components/ui/background-grid";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Música Pa Que 💃",
	description: "Discover music without the algorithms",
};



export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn("min-h-screen bg-background font-sans antialiased", inter)}
			>
				<Providers>
					<BackgroundGrid>
						<TopNav />
						{children}
					</BackgroundGrid>
				</Providers>
			</body>
		</html>
	);
}
