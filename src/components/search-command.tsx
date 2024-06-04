"use client";

import { useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Separator } from "./ui/separator";

const fetchResults = async (query: string) => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/search?q=${query}`,
	);

	if (!res.ok) throw new Error("Failed to fetch search results");

	return res.json();
};

export default function SearchCommand() {
	const router = useRouter();

	const inputRef = useRef<HTMLInputElement>(null);

	const [input, setInput] = useState<string>("");
	const [debouncedInput] = useDebounce(input, 500);

	const { data: searchResults } = useQuery<{
		results: string[];
		duration: number;
	}>({
		queryKey: ["search", debouncedInput],
		queryFn: async () => fetchResults(debouncedInput),
		enabled: !!debouncedInput,
		staleTime: 500,
	});

	const reset = () => {
		setInput("");
		inputRef.current?.blur();
	};

	return (
		<div className="relative  h-[42px]">

		<div className="absolute w-full">

		<Command className="rounded-lg border shadow-lg" label="Command Menu" loop>
			<CommandInput
				value={input}
				onValueChange={setInput}
				placeholder="Search your favorite song, genre, artist..."
				ref={inputRef}
				onKeyDown={(e) => {
					if (input === "") return;

					if (e.key === "Escape") reset();

					if (e.key === "Enter") {
						reset();
						router.push(`/?q=${input}`);
					}
				}}
			/>
			<CommandList>
				{!searchResults || !input ? null : searchResults?.results ? (
					<>
						<CommandGroup heading="Results">
							{searchResults?.results.map((result) => (
								<Link key={result} onClick={reset} href={`?q=${result}`} passHref>
									<CommandItem>{result}</CommandItem>
								</Link>
							))}
						</CommandGroup>
						<Separator />
						<p className="p-2 text-xs text-zinc-500">
							Found {searchResults.results.length} results in{" "}
							{searchResults?.duration.toFixed(0)}ms
						</p>
					</>
				) : (
					<CommandEmpty>No results found.</CommandEmpty>
				)}
			</CommandList>
		</Command>
		</div>
		</div>

	);
}
