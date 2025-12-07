
<script lang="ts">

    let promptId: number = $state(0);
    let show: boolean = $state(false);
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
        console.log("id: ", id);
        console.log("message: ", message);
        promptId = id;
        promptMessage = message;
        promptInput = "";
        show = true;
    });

    // @ts-ignore
    window.api.onPromptHide(() => {
        show = false;
    });

    function submitPrompt() {

        // @ts-ignore
        window.api.sendPromptResponse({
            id: promptId,
            answer: promptInput,
        });
    };

</script>

<div
    id="prompt-modal"
    class={show ? "" : "hidden"}
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
        position: fixed;
        top: 0;
        left: 0; 
        width: 100%;
        height:100%;
        background:rgba(0,0,0,0.5); 
        display:flex;
        justify-content:center;
        align-items:center;
        z-index: 4;
    }
    #prompt-modal.hidden {
        display: none;
    }
    #prompt-modal-inner {
        background: white;
        padding: 20px;
        border-radius: 5px;
    }
</style>
