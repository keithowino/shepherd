## One observation about result ordering

Your search for naruto returned Boruto: Naruto Next Generations before Naruto itself.

This is consistent with the repository's current alphabetical sorting:

```js
.sort({ title: 1 })
```

That is not a functional error. However, it raises a product-design question worth considering before frontend integration.

For an autocomplete search, we could eventually improve relevance ranking:

1. Exact title matches.
2. Titles beginning with the query.
3. Titles containing the query.
4. Matches in alternative titles, native titles, and other titles.
   For example, searching naruto would ideally place Naruto ahead of Boruto: Naruto Next Generations.

I recommend keeping the current implementation for now. We can improve relevance ranking as a separate enhancement rather than introducing unnecessary complexity into the working endpoint.

---
