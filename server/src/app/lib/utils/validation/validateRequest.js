import { AppError } from "../error/index.js";

export default function validateRequest({ body, params, query, headers }, req) {
	/**
	 * console.log("[Validation] Incoming body", req.body);
	 * const parsedBody = body ? body.parse(req.body) : req.body;
	 * console.log("[Validation] Parsed body", parsedBody);
	 * body: parsedBody,
	 */
	return {
		body: body ? body.parse(req.body) : req.body,
		params: params ? params.parse(req.params) : req.params,
		query: query ? query.parse(req.query) : req.query,
		headers: headers ? headers.parse(req.headers) : req.headers,
	};
}

// export const validate =
// 	(schema, source = "query") =>
// 	(req, _res, next) => {
// 		const parsed = schema.safeParse(req[source]);
// 		if (!parsed.success) {
// 			return next(
// 				new AppError(
// 					"Invalid request",
// 					400,
// 					"VALIDATION",
// 					parsed.error.issues,
// 				),
// 			);
// 		}
// 		req[source] = parsed.data;
// 		next();
// 	};

export const validate =
	(schema, source = "query") =>
	(req, _res, next) => {
		const parsed = schema.safeParse(req[source]);
		if (!parsed.success) {
			return next(parsed.error); // errorHandler turns ZodError into 400
		}
		// Don't touch req.query / req.params directly.
		if (source === "query") req.validatedQuery = parsed.data;
		else if (source === "params") req.validatedParams = parsed.data;
		else req.validatedBody = parsed.data;
		next();
	};
