import { Router } from "express";
import { mediaController } from "../controllers/index.js";
import { recentQuerySchema, seriesParamsSchema } from "../validators/index.js";
import { validate } from "../../../app/index.js";

const router = Router();

router.get(
	"/recent",
	validate(recentQuerySchema, "query"),
	mediaController.list,
);
router.get(
	"/series/:id",
	validate(seriesParamsSchema, "params"),
	mediaController.series,
);

export default router;
