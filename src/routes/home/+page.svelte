
<script lang="ts">
    import { authHandlers, authStore } from "../../stores/authStore";
    import { auth } from '../../lib/firebase/firebase.client';

    let email; 
    authStore.subscribe((curr) => {
        console.log('CURR', curr);
        email = curr?.currentUser?.email;
    });
    let prompt:string = "";
    let messages:string[] = [];

    async function sendPrompt() {
        const response = await fetch("/home", {
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
{#if $authStore.currentUser}
<body>
    <div class="navbar">
        <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/map"> Find a Office</a></li>
            <li><a href = "#" on:click={authHandlers.logout}>Logout</a></li>
        </ul>
    </div>

    <div class="content">
        <h1>Welcome</h1>
        <p>PLEASE DO NOT RELIE ON THIS WEBSITE FOR MEDICAL TREATMENT! IF YOU'RE FEELING UNWELL, CONSULT WITH A MEDICAL PROFESSIONAL.</p>
    </div>
</body>

<form method="POST" on:submit|preventDefault={sendPrompt}>
    <label for="prompt">
        <textarea name="prompt" rows="5" bind:value={prompt}></textarea>
        <button type="submit">Send</button>
    </label>
</form>

{#each messages as message}
  <div class="message-container">
    <p class="message-text">{message}</p>
  </div>
{/each}

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


footer {
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 50%; /*helped moved the footer right in the middle*/
    width: 100;
    padding: 10px 20px; /*this helps align the footer nicely. not too low to the screen*/

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
    .message-container {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    margin: 10px 0;
    }
    .message-text {
    white-space: pre-wrap; /* Allows the text to wrap */
    word-wrap: break-word; /* Prevents long words from breaking layout */
    margin: 0;
  }

</style>

