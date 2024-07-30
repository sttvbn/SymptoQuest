
<script lang="ts">
    import { authHandlers, authStore } from "../../stores/authStore";
    import { auth } from '../../lib/firebase/firebase.client';
    import { getDatabase, ref, set} from "firebase/database"

    let email; 
    //let firstname;
    authStore.subscribe((curr) => {
        console.log('CURR', curr);
        email = curr?.currentUser?.email;
        //firstname = curr?.currentUser?.firstname;
    });
    let prompt:string = "";
    //let messages:string[] = [];
    let messages:{prompt: string, response: string}[] = [];

    async function sendPrompt() {
        const response = await fetch("/home", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `prompt=${encodeURIComponent(prompt)}`
        });

        if (response.ok) {
            const message = await response.json();
            messages = [...messages, {prompt, response: message.data}]; 
            prompt = "";//this should clear the textarea after sending 
        } 
    }

    function saveConversation(conversation) {
        const db = getDatabase();
        const conversationId = Date.now().toString();
        set(ref(db, 'conversations/' + conversationId), {
            conversationId: conversationId,
            email: email,
            timestamp: new Date().toISOString(),
            conversation: conversation
        });
    }

    function endConversation(){
        saveConversation(messages);
        messages = [];
    }
</script>
{#if $authStore.currentUser}
<body>
    <div class="navbar">
        <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/location"> Find a map</a></li>
            <li><a href="/summary"> Summary </a></li>
            <li><a href = "#" on:click={authHandlers.logout}>Logout</a></li>
        </ul>
    </div>

    <div class="content">
        <h1>Welcome { email }</h1>
        <p>PLEASE DO NOT RELIE ON THIS WEBSITE FOR MEDICAL TREATMENT! IF YOU ARE FEELING UNWELL, CONSULT WITH A MEDICAL PROFESSIONAL.</p>
    </div>

    <form method="POST" on:submit|preventDefault={sendPrompt}>
        <label for="prompt">
            <textarea name="prompt" rows="5" bind:value={prompt}></textarea>
            <button type="submit">Send</button>
        </label>
    </form>


    <div class = "container">
        {#each messages as { prompt, response }}
            <div class="message-block">
                <pre class="message"><strong>{email}:</strong> {prompt}</pre>
                <pre class="message"><strong>Assistant:</strong> {response}</pre>
            </div>
            {/each}
    </div>

    <button on:click={endConversation}>End Conversation</button>

</body>


<footer> 
    <p1> Copyright 2024 SymptoQuest</p1>
</footer>
{:else}
<div>Error....</div>
{/if}


<style>


    ul {
        list-style-type: none; /*remove the bulletpoint */
        padding: 0; 
        margin: 0; 
        display: flex; /*make them rows instead of list*/
        font-family: Arial, sans-serif;
    }
    .navbar {
        overflow: hidden;
        background-color: #333;
        padding: 10px 0px;
        position: fixed; /*place the nav to the very top*/
        width: 100%;
        top: 0; /*this helps the nav go fully to the top*/
        left: 0; 
        display: flex; /*makes the buttons into rows not a list*/
        justify-content: flex-end;
        
    }
    
    .navbar a {
        display: block;
        color: white;
        /*text-align: center;*/
        padding: 14px 20px;
        text-decoration: none;
        margin-left: 50px; /*this helps space out the buttons*/
    }
    
    
    .navbar a:hover {
        background-color: #ddd;
        color: black;
    }
    
    .content {
        padding: 100px;
        text-align: center;
    
    }

    html, body{
        height: 100%;
        margin: 0;
    }

    body{
        display: flex;
        flex-direction: column;
        min-height: 90vh;
    }
    
    
    footer {
    text-align: center;
    position: relative;
    bottom: 0;
    left: 0; /*helped moved the footer right in the middle*/
    width: 100%;
    padding: 1rem 20px; /*this helps align the footer nicely. not too low to the screen*/
    }
    
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
        width: 500px;
        margin-bottom: 5px;
        align-items: center;
        border-radius: 5px;
    }
    button{
        width: 100px;
        padding: 5px;
        color:blue;
    }
    label{
        align-items: center;
    }
    
    
    .container{
        max-height: 70vh;
        overflow-y: auto;
        padding: 10px;
        margin-top: 20px;
        border: 0px solid #ccc; /*this will show the border line of the response*/
        max-width: 90%;
        margin: 20px auto;
    }
    .message{
        white-space: pre-wrap;
        word-wrap: break-word;
        margin-bottom: 10px;
        padding: 10px; 
        background: color #f1f1f1;
        border-radius:50px;
    }

    button {
        margin-top: 20px;
    }
    
    </style>
