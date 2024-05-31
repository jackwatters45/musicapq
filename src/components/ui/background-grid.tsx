"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function BackgroundGrid({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const { resolvedTheme } = useTheme();

	return (
		<div
			className={cn(
				"h-full w-full bg-background  relative flex items-center justify-center bg-grid-foreground/[0.2]",
				resolvedTheme === "dark" ? "bg-grid-white/[0.2]" : "bg-grid-black/[0.2]",
			)}
		>
			<div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
			<div className="relative z-20 bg-clip-text">{children}</div>
		</div>
	);
}
