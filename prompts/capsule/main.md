## Architectural improvement to consider later

There is another consideration worth keeping in mind: your pagination is currently implemented inside AnimeGrid, which also handles API requests, loading states, errors, and rendering.

That is perfectly acceptable for the current implementation.

However, if you eventually reuse AnimeGrid for search results, category listings, or other paginated collections, we may want to extract the URL pagination logic into a reusable hook.

---
