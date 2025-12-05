
<script lang="ts">

    import {
        goTo,
    } from "./path";

    let inputPath = $state("");

    function handleKeyDown(e: KeyboardEvent) {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        if (e.key === "Enter") {
            console.log("Enter key was pressed");
            goTo(value);
            return;
        };
        inputPath = value;
    };

</script>

<input
    bind:value={inputPath}
    onkeydown={handleKeyDown}
    placeholder="Enter path"
/>

<style>
</style>
