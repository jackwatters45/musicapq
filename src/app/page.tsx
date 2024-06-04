import { getQueryResults } from "./actions";
import type { QueryResults } from "./actions";
import type { SearchParams } from "../../types";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchCommand from "../components/search-command";
import SuggestStandardGenre from "@/components/suggest-genre/suggest-genre";

// TODO
// actual fetch
// search?q= -> should be same / route

// connect db and implement suggest new genre

// check out browser spotify for some routing logic inspo

// figma this jawn
// better way to display results

// search only official genres, artists, and playlists, etc
// actual topic/search page shows non official default sorted by popularity
// should exist on topic page mot here ?????????????

export default async function Page({
	searchParams,
}: { searchParams: SearchParams }) {
	const { results, error } = await getQueryResults(searchParams.q);

	return (
		<main className="h-screen w-screen px-6 ">
			<div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
				<h1 className="text-5xl font-bold text-foreground">Música Pa Que 💃</h1>
				<p className="text-secondary-foreground text-lg max-w-prose text-center">
					Discover music without the algorithms <br /> Type a vibe, playlist, genre,
					or artist to get started
				</p>
				<div className="max-w-md w-full space-y-6 py-6">
					<SearchCommand />
					<Card>
						<CardHeader className="text-xl font-extrabold">Search Results</CardHeader>
						<CardContent>
							<JsonDisplay
								searchParams={searchParams}
								results={results}
								error={error}
							/>
						</CardContent>
					</Card>
				</div>

				<SuggestStandardGenre />
			</div>
		</main>
	);
}

function JsonDisplay({
	searchParams,
	results,
	error,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
	results: QueryResults["results"];
	error: QueryResults["error"];
}) {
	return (
		<>
			<h2 className="font-bold">Query</h2>
			<p>{searchParams.q}</p>
			<h2 className="font-bold">Data</h2>
			<pre>{JSON.stringify(results, null, 2)}</pre>
			<h2 className="font-bold">Error</h2>
			<pre>{JSON.stringify(error, null, 2) ?? "none"}</pre>
		</>
	);
}
