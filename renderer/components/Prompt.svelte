
<script lang="ts">

    let promptId: number = $state(0);
    let showPrompt: boolean = $state(false);
    let promptMessage: string = $state("");
    let promptInput: string = $state("");

    // This callback runs when the main process asks to show the prompt
    // @ts-ignore
    window.api.onPromptShow(({
        id,
        message
    }: {
        id: number,
        message: string
    }) => {
        promptId = id;
        promptMessage = message;
        promptInput = "";
        showPrompt = true;
    });

    function submitPrompt() {

        // @ts-ignore
        window.api.sendPromptResponse({
            id: promptId,
            answer: promptInput,
        });
        showPrompt = false;
    };

</script>

<div
    id="prompt-modal"
>
    <div
        id="prompt-modal-inner"
    >
        <p>
            {promptMessage}
        </p>
        <input
            bind:value={promptInput}
            id="prompt-input"
            type="text"
        />
        <button
            onclick={submitPrompt}
        >
            OK
        </button>
    </div>
</div>

<style>
    #prompt-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0; 
        width: 100%;
        height:100%;
        background:rgba(0,0,0,0.5); 
        display:flex;
        justify-content:center;
        align-items:center;
    }
    #prompt-modal-inner {
        background: white;
        padding: 20px;
        border-radius: 5px;
    }
</style>
