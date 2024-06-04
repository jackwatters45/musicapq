"use server";

import type { z } from "zod";
import { schema } from "./suggest-genre";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";

type SchemaData = z.infer<typeof schema>;

export async function createGenreSuggestion(
	prevState: unknown,
	formData: FormData,
) {
	const submission = parseWithZod(formData, { schema });

	if (submission.status !== "success") {
		return submission.reply();
	}

  // TODO change to just add to postgre db
	const submitS = async (data: SchemaData) => ({ sent: true });
	const message = await submitS(submission.value);

  console.log(message);

  redirect('/dashboard');

  // return message;
}
