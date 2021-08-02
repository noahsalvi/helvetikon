const c = [
	() => import("../components/layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/api/words/index.ts
	[/^\/api\/words\/?$/],

	// src/routes/api/words/[query].ts
	[/^\/api\/words\/([^/]+?)\/?$/]
];

export const fallback = [c[0](), c[1]()];