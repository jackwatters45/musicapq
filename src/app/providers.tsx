"use client";

import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			if (query.meta?.errorMessage) {
				// toast.error(query.meta.errorMessage);
			}
		},
	}),
});

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	);
}
