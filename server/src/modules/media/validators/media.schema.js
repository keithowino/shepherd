import { z } from "zod";

export const recentQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	perPage: z.coerce.number().int().min(1).max(50).default(20),
});

export const seriesParamsSchema = z.object({
	id: z.coerce.number().int().positive(),
});

export const searchQuerySchema = z.object({
	q: z
		.string()
		.trim()
		.min(2, "Search query must be at least 2 characters.")
		.max(100, "Search query is too long."),

	limit: z.coerce.number().int().min(1).max(20).default(10),
});
