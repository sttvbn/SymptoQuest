<script>
    import { authHandlers, authStore } from "../../stores/authStore";
    import { auth } from '../../lib/firebase/firebase.client';
    import { getDatabase, ref, get } from "firebase/database";
    import { onMount } from 'svelte';

    let email; 
    let conversations = [];
    let summary = '';

    authStore.subscribe((curr) => {
        console.log('CURR', curr);
        email = curr?.currentUser?.email;
    });


    async function fetchConversations() {
        const db = getDatabase();
        const snapshot = await get(ref(db, 'conversations/'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            conversations = Object.values(data).filter(convo => convo.email === email);
        } else {
            console.log("No data available");
        }
    }

    async function fetchSummary(conversation) {
        const response = await fetch("/summary", {
            method: 'POST',
            body: JSON.stringify({conversation}),
            headers: { "Content-Type": "application/json"}
        });

        if (!response.ok) {
            summary = 'An error occured while fetching the summary'
            return;
        }
        const data = await response.json();
        if (data.summary) {
            summary = data.summary;
        } else {
            console.error('Invalid response format:', data);
            summary = 'Failed to get summary';
        }
        //summary = data.summary;

     
    }

    onMount(async () => {
        await fetchConversations();
    });
    
</script>
{#if $authStore.currentUser}
<body>
    <div class="navbar">
        <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/location"> Map</a></li>
            <li><a href="/summary"> Summary </a></li>
            <li><a href = "#" on:click={authHandlers.logout}>Logout</a></li>
        </ul>
    </div>

    <div class="content">
        <h1>Welcome to the Summary/history page of user: {email}</h1>
        <p>PLEASE DON'T BELEIVE EVERYTHING ON THIS WEBSITE FOR MEDICAL TREATMENT! IF YOU'RE FEELING UNWELL, CONSULT WITH A MEDICAL PROFESSIONAL.</p>
    </div>

    <div class = "history">
        {#if conversations.length > 0}
            <div class = "convo-list">
                {#each conversations as conversation}
                    <div class ="conversation">
                        <p><strong>Data:</strong> {new Date(conversation.timestamp).toLocaleString()}</p>
                        <div class = "messages">
                            {#each conversation.conversation as msg}
                                <div class = "message">
                                    <p><strong>{email}: </strong>{msg.prompt}</p>
                                    <p><strong>Assistant: </strong>{msg.response}</p>
                                </div>
                            {/each}
                        </div>
                        <button on:click={() => fetchSummary(conversation)}>Summary</button>
                        {#if summary}
                            <div class = "summary">
                                <h2>Summary</h2>
                                <p>{summary}</p>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {:else}
                <p>No conversations found.</p>
        {/if}
    </div>
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

    .convo-list{
        text-align: left;
    }

    .conversation{
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 20px;
    }

    .messages {
        margin-left: 20px;
    }

    .message {
        margin-bottom: 10px;
    }

    .message p{
        margin: 0;
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
    
    </style>