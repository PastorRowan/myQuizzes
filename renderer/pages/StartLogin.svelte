
<script lang="ts">

    import {
        startLogin
    } from "../auth/index";

    let phoneNumber = $state("");
    let password = $state("");
    let smsCode = $state("");
    let isWaitingSms = $state(false);

    function isPhoneNumberValid(str: string) {
        return (str[0] === "+" && /^\d+$/.test(str)) || /^\d+$/.test(str);
    };

    // Sends the SMS and revals enter SMS button
    async function handleClick() {

        if (!isWaitingSms) {
            return;
        };

        isWaitingSms = true;

        const isValidPhoneNumberValid = isPhoneNumberValid(phoneNumber);
        if (isValidPhoneNumberValid) {
            // Get the async function that expects the SMS code later
            const result = await startLogin({ phoneNumber, password });
            if (result.is) {

            };
            return;
        } else {
            isWaitingSms = false;
            alert("Phone number invalid");
        };
    };

</script>

<div class="login-page-cont">
	<h1>Enter Login</h1>
    <input
        bind:value={phoneNumber}
        placeholder="Phone number"
        type="tel"
    />
    <input
        bind:value={password}
        placeholder="Password"
        type="password"
    />
    <button
        onclick={handleClick}
    >
        Send SMS
    </button>
    <input
        bind:value={smsCode}
        placeholder="SMS"
    />
</div>

<style>
    .login-page-cont {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
</style>
