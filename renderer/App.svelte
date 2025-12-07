
<script lang="ts">

    import {
        isQuestions
    } from "../helpers/validators";

    import {
        Prompt,
        JsonEditor
    } from "./components/index";

    let channelWebLinkInput: string = $state("");
    let quizJsonTextInput: string = $state("");
    let jsonEditorApi: any;

    console.log("jsonEditorApi: ", jsonEditorApi);

    async function handleSendQuestionsButClick(e: Event) {

        console.log("jsonEditorApi: ", jsonEditorApi);

        const channelWebLink: string = channelWebLinkInput;

        const TELEGRAM_WEB_CHANNEL_LINK_REGEX = /web\.telegram\.org\/k\/#(-?\d+)/;

        // Validate invite link
        if (!TELEGRAM_WEB_CHANNEL_LINK_REGEX.test(channelWebLink)) {
            alert("Invalid channel link. It must look like:\nhttps://web.telegram.org/k/#-123456789");
            return;
        };

        const match = channelWebLink.match(TELEGRAM_WEB_CHANNEL_LINK_REGEX);
        const rawId: string | null = match ? match[1] : null;

        if (rawId === null) {
            throw new Error("web channel link is incorrect");
        };

        console.log("rawId: ", rawId);

        // rawId is something like "-1234567890"
        const channelId: string = "-100" + rawId.replace(/^-/, "");

        console.log("channelId: ", channelId);

        const TELEGRAM_CHANNEL_ID_REGEX = /^-100\d+$/;

        if (!TELEGRAM_CHANNEL_ID_REGEX.test(channelId)) {
            alert("Invalid Telegram channel ID format. Should be for example -1001234567890");
            return;
        };

        let questions: any;
        quizJsonTextInput = jsonEditorApi.getValue();
        try {
            questions = JSON.parse(quizJsonTextInput);
        } catch (error: any) {
            alert("Invalid JSON. Please check your quiz json.");
            return;
        };

        if (!isQuestions(questions)) {
            alert("Quiz json is not following the correct schema\nPlease check the text editor");
            return;
        };

        // @ts-ignore
        await window.api.sendQuestions({
            questions: questions,
            channelId: channelId,
        });

    };

</script>

<main>
    <Prompt />
	<h1>Enter Info</h1>
    <input
        bind:value={channelWebLinkInput}
        placeholder="Channel invite link"
    />
    <JsonEditor
        bind:this={jsonEditorApi}
    />
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
</style>
