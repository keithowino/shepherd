import { mediaService } from "../services/index.js";
import { success } from "../../../app/index.js";

export const mediaController = {
	async list(req, res, next) {
		try {
			const { page, perPage } = req.validatedQuery;
			const result = await mediaService.getRecent({ page, perPage });

			return success(
				res,
				result.items,
				"Recent anime fetched.",
				200,
				result.pagination,
			);
		} catch (err) {
			next(err);
		}
	},

	async series(req, res, next) {
		try {
			const { id } = req.validatedParams;

			const result = await mediaService.getSeries(id);

			return success(res, result, "Series fetched.");
		} catch (err) {
			next(err);
		}
	},
};
