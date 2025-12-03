
<script lang="ts">

    import {
        Prompt
    } from "./components/index";

    import type {
        Question,
        Poll
    } from "../types/index";

    import * as monaco from 'monaco-editor';

    import { onMount } from "svelte";

    const pollSchema = {
        type: "array",
        title: "Poll",
        items: {
            type: "object",
            required: ["question", "options", "correctOption"],
            properties: {
                question: {
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

    let editor: any;
    let editorContainer: HTMLDivElement;

    onMount(() => {
        // Register your schema
        monaco.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: [{
                uri: "http://myserver/myschema.json", // an identifier for your schema
                fileMatch: ["*"],                      // files to associate with this schema
                schema: pollSchema                     // your JSON schema object
            }]
        });

        // Create editor
        monaco.editor.create(editorContainer, {
            value: '[]', // initial JSON text
            language: 'json',
            automaticLayout: true,
        });
    });



    let channelInviteLinkInput: string = $state("");
    let quizJsonTextInput: string = $state("");

    async function handleSendQuestionsButClick(e: Event) {

        const channelInviteLink: string = channelInviteLinkInput;

        const TELEGRAM_INVITE_REGEX =
            /^(?:https?:\/\/)?(?:t|telegram)\.(?:me|dog)\/(?:joinchat\/|\+)?([\w-]+)$/i;

        // Validate invite link
        if (!TELEGRAM_INVITE_REGEX.test(channelInviteLink)) {
            alert("Invalid channel invite link. It must look like:\nhttps://t.me/+abcd1234xyz or https://t.me/joinchat/abcd1234");
            return;
        };

        let poll: Poll;
        try {
            poll = JSON.parse(quizJsonTextInput) as Poll;
        } catch (error: any) {
            alert("Invalid JSON. Please check your quiz format.");
            return;
        };

        // @ts-ignore
        await window.api.createPoll({
            poll: poll,
            channelInviteLink: channelInviteLink,
        });
    };

</script>

<main>
    <Prompt />
	<h1>Enter Info</h1>
    <input
        bind:value={channelInviteLinkInput}
        placeholder="Channel invite link"
    />
    <div
        bind:this={editorContainer}
        id="editor"
    >
    </div>
    <button
        onclick={handleSendQuestionsButClick}
    >Send Questions</button>
</main>

<style>
	main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
		padding: 1em;
	}
	@media (min-width: 640px) {
		main {
            max-width: none;
		}
	}
    h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
    input {
        min-width: 400px;
    }
    /*
    textarea {
        min-width: 400px;
        max-width: 700px;
        min-height: 450px;
        max-height: 800px;
    }
    */
</style>
