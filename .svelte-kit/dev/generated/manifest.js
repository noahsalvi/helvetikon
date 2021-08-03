const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/[word]/index.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/api/words/index.ts
	[/^\/api\/words\/?$/],

	// src/routes/api/words/faker.ts
	[/^\/api\/words\/faker\/?$/],

	// src/routes/api/words/[word].ts
	[/^\/api\/words\/([^/]+?)\/?$/],

	// src/routes/[word]/index.svelte
	[/^\/([^/]+?)\/?$/, [c[0], c[3]], [c[1]], (m) => ({ word: d(m[1])})]
];

export const fallback = [c[0](), c[1]()];