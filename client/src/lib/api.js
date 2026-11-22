const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

async function getResponse(path, options = {}) {
	const res = await fetch(`${BASE}${path}`, options);
	const json = await res.json();

	if (!res.ok || json?.success === false) {
		throw new Error(
			json?.error?.message ?? `Request failed (${res.status})`,
		);
	}

	return json;
}

async function get(path, options = {}) {
	const json = await getResponse(path, options);
	return json.data;
}

export const api = {
	recent: async (page = 1, perPage = 20) => {
		const json = await getResponse(
			`/anime/recent?page=${page}&perPage=${perPage}`,
		);

		return {
			items: json.data,
			pagination: json.meta,
		};
	},

	search: (query, { limit = 10, signal } = {}) => {
		const params = new URLSearchParams({
			q: query,
			limit: String(limit),
		});

		return get(`/anime/search?${params.toString()}`, { signal });
	},

	series: (id) => get(`/anime/series/${id}`),
};
