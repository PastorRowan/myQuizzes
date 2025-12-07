
<script lang="ts">

    import { parseTree, findNodeAtLocation } from 'jsonc-parser';

    import Ajv from "ajv";

    import { onMount } from "svelte";

    // @ts-ignore
    import ace from "ace-builds/src-min-noconflict/ace";
    import "ace-builds/src-min-noconflict/mode-json";
    import "ace-builds/src-min-noconflict/theme-github";
    import "ace-builds/src-min-noconflict/worker-json";

    const pollSchema = {
        type: "array",
        title: "Poll",
        items: {
            type: "object",
            required: ["query", "options", "correctOption"],
            properties: {
                query: {
                    type: "string",
                    title: "Question"
                },
                options: {
                    type: "array",
                    title: "Options",
                    items: {
                        type: "string",
                        title: "Option"
                    },
                    minItems: 2
                },
                correctOption: {
                    type: "number",
                    title: "Correct Option Index",
                    minimum: 0
                }
            }
        }
    };

    const ajv = new Ajv();
    const validate = ajv.compile(pollSchema);

    function updateAnnotations(aceEditor: any) {
        let annotations: any[] = [];
        const text = aceEditor.getValue();

        try {
            // parse JSON tree with position info
            const errors: any[] = [];
            const rootNode = parseTree(text, errors);
            if (errors.length >= 1) {
                throw errors[0];
            };
            const data = JSON.parse(text);
            const valid = validate(data);

            if (!valid && validate.errors && rootNode) {
                annotations = validate.errors.map((error: any) => {
                    // Convert AJV's dataPath to path array

                    const dataPath: string = error.dataPath;

                    const pathArray: (string | number)[] = dataPath
                        .replace(/\]\[/g, '.')
                        .replace(/\[/g, '.')
                        .replace(/\]/g, '')
                        .replace(/^\./, '')
                        .replace(/\.$/, '')
                        .split('.')
                        .map(segment => /^\d+$/.test(segment) ? Number(segment) : segment);

                    // Find the node in AST corresponding to error path
                    const node = findNodeAtLocation(rootNode, pathArray);

                    console.log("node: ", node);

                    let row = 0;
                    if (node) {
                        // node.offset is the start index in the text string
                        // count newlines before offset to get zero-based line number
                        row = text.slice(0, node.offset).split('\n').length - 1;
                    };

                    return {
                        row,
                        column: 0,
                        text: `Schema error: ${error.instancePath} ${error.message}`,
                        type: "error",
                    };
                });
            };

            aceEditor.getSession().setAnnotations(annotations);
        } catch (error: any) {

        };
    };

    let editorContainer: HTMLDivElement;
    let editor: any;
    let {
        value = undefined
    } = $props();

    onMount(function() {
        // Create ace editor instance
        editor = ace.edit(editorContainer, {
            mode: "ace/mode/json",
            theme: "ace/theme/github",
            tabSize: 2,
            useSoftTabs: true,
        });

        let debounceTimer: ReturnType<typeof setTimeout>;

        editor.session.on("change", () => {
            value = editor.getValue();

            // Clear previous timer, if any
            if (debounceTimer) clearTimeout(debounceTimer);

            // Set new timer to call updateAnnotations after 2 seconds
            debounceTimer = setTimeout(() => {
                updateAnnotations(editor);
            }, 2000);

        });

    });

    // External Api
    export function getValue() {
        if (editor) {
            return editor.getValue();
        };
        return null;
    };

</script>

<div
    bind:this={editorContainer}
    id="editor"
>
</div>

<style>
    #editor {
        width: 700px;
        height: 400px;
        font-size: 14px;
    }
</style>
