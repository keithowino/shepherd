import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAnimeSearch } from "../hooks/useAnimeSearch";

import {
	Autocomplete,
	AutocompleteContent,
	AutocompleteEmpty,
	AutocompleteInput,
	AutocompleteItem,
	AutocompleteList,
	AutocompleteStatus,
} from "@/components/ui/autocomplete";

import { Label } from "@/components/ui/label";

const AnimeSearch = () => {
	const id = useId();
	const navigate = useNavigate();

	const [query, setQuery] = useState("");

	const { results, status, error, isLoading, isDebouncing } =
		useAnimeSearch(query);

	const items = results.map((anime) => ({
		id: anime._id,
		value: anime.title,
		anime,
	}));

	const handleSelect = (anime) => {
		navigate(`/anime/${anime._id}`);
	};

	const statusMessage = isDebouncing
		? "Preparing search..."
		: isLoading
			? "Searching anime..."
			: error;

	const showStatus = isDebouncing || isLoading || status === "error";

	return (
		<Autocomplete
			items={items}
			value={query}
			onValueChange={setQuery}
			mode="none"
			autoHighlight
		>
			<Label htmlFor={id} className="sr-only">
				Search anime
			</Label>

			<AutocompleteInput
				id={id}
				placeholder="Search by title, alternative or native name"
				aria-label="Search anime"
				autoComplete="off"
				showClear
				className="h-10 rounded-full bg-muted/60 text-sm"
			/>

			<AutocompleteContent className="w-(--anchor-width)">
				{showStatus && (
					<AutocompleteStatus
						className={
							status === "error"
								? "px-3 py-2 text-sm text-destructive"
								: "px-3 py-2 text-sm text-muted-foreground"
						}
					>
						{statusMessage}
					</AutocompleteStatus>
				)}

				{status === "success" && results.length === 0 && (
					<AutocompleteEmpty>
						No anime found. Try another title.
					</AutocompleteEmpty>
				)}

				<AutocompleteList>
					{(item) => (
						<AutocompleteItem
							key={item.id}
							value={item.value}
							onClick={() => handleSelect(item.anime)}
							className="cursor-pointer px-3 py-2.5 data-highlighted:bg-accent data-highlighted:text-accent-foreground"
						>
							<div className="flex w-full items-center gap-3">
								{item.anime.poster ? (
									<img
										src={item.anime.poster}
										alt=""
										loading="lazy"
										className="h-14 w-10 shrink-0 rounded-sm object-cover"
									/>
								) : (
									<div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-sm bg-muted text-xs text-muted-foreground">
										N/A
									</div>
								)}

								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium">
										{item.anime.title}
									</p>

									<p className="mt-1 truncate text-xs text-muted-foreground">
										{[item.anime.year, item.anime.native]
											.filter(Boolean)
											.join(" · ") || "Anime"}
									</p>
								</div>
							</div>
						</AutocompleteItem>
					)}
				</AutocompleteList>
			</AutocompleteContent>
		</Autocomplete>
	);
};

export default AnimeSearch;
