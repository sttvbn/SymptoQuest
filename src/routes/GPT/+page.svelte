<h1>SymptoQuest chat</h1>
<h2>lets chat</h2>
<style>
    h1{
        font-size: 36px;
        text-align: center;
    }
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    textarea{
        width: 300px;
        margin-bottom: 10px;
        align-items: center;
    }
    button{
        width: 100px;
        padding: 5px;
        color:blue
    }
    label{
        align-items: center;
    }
    nav a{
        float: left;
        display: block;
        color: rgb(198, 23, 23);
        text-align: center;
        padding: 14px 16px;
        text-decoration: none; 
    }
    nav a:hover{
        background-color: #b70d0d;
        color: black;
    }
</style>

<script lang="ts">
    let prompt:string = "";
    let messages:string[] = [];

    async function sendPrompt() {
        const response = await fetch("/GPT", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `prompt=${encodeURIComponent(prompt)}`
        });
        const message = await response.json();
        messages = [...messages, message.data];
    }
</script>
<nav>
    <a href="home">Home</a>
    <a href="about">About</a>
    <a href="Maps">Maps</a>
</nav>

<form method="POST" on:submit|preventDefault={sendPrompt}>
    <label for="prompt">
        Prompt:
        <textarea name="prompt" rows="5" bind:value={prompt}></textarea>
        <button type="submit">Send</button>
    </label>
</form>

{#each messages as message}
    <pre>{message}</pre>
    {/each}
