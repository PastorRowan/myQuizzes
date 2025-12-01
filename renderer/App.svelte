
<script lang="ts">

    import {
        GoToBut,
        Prompt
    } from "./components/index";

    import { Router } from "../router/index";

    import type {
        Route,
        Routes,
    } from "../router/types";

    import {
        Home,
    } from "./pages/index";

    const routes: Routes = [
        {
            path: "/",
            component: Home,
        },
    ];

    const start = "/";

</script>

<main>
    <Prompt />
    <Router
        {routes}
        start={start}
    ></Router>
    <GoToBut />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
