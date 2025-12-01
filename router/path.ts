
// path.svelte.ts
import {
    writable
} from "svelte/store";

export const path = writable(window.location.hash.slice(1) || "/");

function updatePath() {
    path.set(window.location.hash.slice(1) || "/");
    console.log("updated path: ", window.location.hash.slice(1));
};

// Update the hash and path store to navigate
export function goTo(newPath: string) {
    window.location.hash = newPath;
};

// Listen for hash changes
window.addEventListener("hashchange", updatePath);
