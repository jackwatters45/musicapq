"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";
import { z } from "zod";
import { createGenreSuggestion } from "./actions";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export const schema = z.object({
	genre: z.preprocess(
		(value) => (value === "" ? undefined : value),
		z
			.string({ required_error: "Genre is required" })
			.min(3, "Genre is too short")
			.max(50, "Genre is too long"),
	),
});

export default function SuggestStandardGenre() {
	const [lastResult, action] = useFormState(createGenreSuggestion, undefined);
	const [form, fields] = useForm({
		// Sync the result of last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},

		// Validate the form on blur event triggered
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	return (
		<Card className="w-full max-w-md rounded-lg border shadow-lg">
			<form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
				<CardContent className="pt-6 space-y-4">
					<Label className="font-bold text-lg">Suggest a New Genre</Label>
					<Input type="genre" key={fields.genre.key} name={fields.genre.name} placeholder="Genre you want to see..." />
					<Button type="submit" className="w-full">
						Submit Request
					</Button>
					<div className="text-destructive-foreground">{fields.genre.errors}</div>
				</CardContent>
			</form>
		</Card>
	);
}
