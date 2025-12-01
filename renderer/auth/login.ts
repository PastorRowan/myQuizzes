
export async function startLogin({
    phoneNumber,
    password,
}: {
    phoneNumber: string;
    password: string;
}) {
    // @ts-ignore
    return window.api.startLogin({
        phoneNumber,
        password,
    });
};
