import { AppProviders, AppRouter } from "./app/index.js";

export default function App() {
	return (
		<AppProviders>
			<div className="min-h-screen">
				<div className="container mx-auto py-8 px-4 space-y-6">
					<AppRouter />
				</div>
			</div>
		</AppProviders>
	);
}
