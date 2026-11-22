import { Router } from "express";
import { mediaController } from "../controllers/index.js";
import {
	recentQuerySchema,
	searchQuerySchema,
	seriesParamsSchema,
} from "../validators/index.js";
import { validate } from "../../../app/index.js";

const router = Router();

router.get(
	"/recent",
	validate(recentQuerySchema, "query"),
	mediaController.list,
);

/**
 * One architectural distinction worth preserving: this
 * search endpoint should only query MongoDB. It should
 * not call Anikoto. The catalogue indexing process is
 * now responsible for populating the local search source.
 */
router.get(
	"/search",
	validate(searchQuerySchema, "query"),
	mediaController.search,
);

router.get(
	"/series/:id",
	validate(seriesParamsSchema, "params"),
	mediaController.series,
);

export default router;
