import { AnimeLayout } from "../layouts/index.js";
import { Landing, Player, Updates } from "../pages/index.js";

const gatewayRoutes = [
	{
		path: "/",
		element: <Landing />,
	},
	{
		element: <AnimeLayout />,
		children: [
			{
				path: "/updates",
				element: <Updates />,
			},
			{
				path: "/anime/:id",
				element: <Player />,
			},
		],
	},
];

export default gatewayRoutes;
