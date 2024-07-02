import { Navbar, Footer } from "@/components";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
	title: "Car Hub",
	description: "Discovers the best car in the world.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className='relative'>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
