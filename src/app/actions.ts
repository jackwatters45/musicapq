"use server";

import type { SearchHandlerReturn } from "./api/[[...route]]/route";

export type QueryResults = {
	results: SearchHandlerReturn;
	duration: number;
	error: string | undefined;
};

export const getBaseUrl = () => process.env.BASE_URL;

export async function getQueryResults(
	q: string[] | string | undefined,
): Promise<QueryResults> {
	if (typeof q !== "string") {
		return { results: [], duration: 10, error: undefined }; // needs error?
	}

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/search?q=${encodeURIComponent(q)}`,
	);

	if (!res.ok) {
		return { results: [], duration: 10, error: "error" };
	}

	const results = (await res.json()) as QueryResults["results"];

	return { results, duration: 100, error: undefined };
}
