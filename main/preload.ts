
const { ipcRenderer, contextBridge } = require("electron");

const WINDOW_API = {
    // Listen for prompt-show with { id, message }
    onPromptShow: (callback: any) => 
        ipcRenderer.on(
            "prompt-show",
            (_event: any,
                { id, message }: {id: number; message: string;}
            ) => callback({ id, message })),

    // Send prompt-answer with { id, answer }
    sendPromptResponse: ({ id, answer }: {id: number, answer: string}) =>
        ipcRenderer.send("prompt-answer", { id, answer }),
};

contextBridge.exposeInMainWorld("api", WINDOW_API);
