<script lang="ts">
    let prompt = "";
    let messages: any[] = [];

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
