import { AppProviders, AppRouter } from "./app/index.js";

export default function App() {
	return (
		<AppProviders>
			<div className="min-h-screen">
				<AppRouter />
			</div>
		</AppProviders>
	);
}
