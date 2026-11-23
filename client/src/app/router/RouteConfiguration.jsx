import { Navigate, useRoutes } from "react-router-dom";
import { gatewayRoutes } from "../../modules/index.js";

function ApplicationRoutes() {
	return useRoutes([
		...gatewayRoutes,
		{
			path: "*",
			element: <Navigate to="/" replace />,
		},
	]);
}

export default function RouterConfiguration() {
	return <ApplicationRoutes />;
}
