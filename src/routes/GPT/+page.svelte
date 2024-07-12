<script>
    let prompt = "";
    let messages = [];

    async function sendPrompt(){
        const response = await fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded", 
            },
            body: 'prompt=${encodeURIComponent(prompt)}'
        });
        const message = await response.json();
        messages = [...messages, message.data];
    }
</script>
<style>
    h1 {
        font-size: 36px;
        font-family: Arial, sans-serif; 
        text-align: center; 
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    textarea {
        width: 300px; 
        margin-bottom: 10px;
    }

    button {
        width: 100px;
        padding: 5px;
    }
</style>
<h1>SvelteGPT</h1>

<form method="POST" on:submit|preventDefault={sendPrompt}>
    <label for="prompt">
        Prompt:
        <textarea name="prompt" rows="4"  bind:value={prompt}></textarea>
    </label>
    <button type="submit">Send</button>
</form>

{#each messages as message }
    <pre>{message}</pre>
{/each}
