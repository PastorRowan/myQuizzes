
<script lang="ts">

    import {
        NotFound
    } from "../renderer/pages/index";

    import type {
        Route,
    } from "./types";

    import { path } from "./path";
    import { onDestroy } from 'svelte';

	const {
        routes,
        start = "/",
    }: {
        routes: Route[];
        start?: string;
    } = $props();

    let current: Route = $state<Route>(routes[0]);

    path.set(start);

    console.log("path: ", path);

    // Subscribe to the path store to react to path changes
    const unsubscribe = path.subscribe(currentPath => {
        console.log("subscribe function running");
        // Find matching route
        const match = routes.find(route => route.path === currentPath);

        if (match) {
            current = match;
        } else {
            current = {
                path: currentPath,
                component: NotFound,
            };
        };
    });

    onDestroy(() => {
        console.log("destroying function ");
        unsubscribe();
    });

</script>

<current.component></current.component>
