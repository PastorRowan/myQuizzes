
export function isChannelId(arg: any): arg is ChannelId {
    return (
        typeof arg === "string" &&
        arg.startsWith("-100")
    );
};
