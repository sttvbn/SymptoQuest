<script>
    import { authHandlers, authStore } from "../../stores/authStore";
    import { auth } from '../../lib/firebase/firebase.client';
    import { getDatabase, ref, get } from "firebase/database";
    import { onMount } from 'svelte';

    let email; 
    let conversations = [];
    let summaries = {};
    //let selectedConversation = null;

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
            summaries[conversation.timestamp] = 'An error occured while fetching the summary'
            return;
        }
        const data = await response.json();
        if (data.summary) {
            summaries[conversation.timestamp] = data.summary;
        } else {
            console.error('Invalid response format:', data);
            summaries[conversation.timestamp] = 'Failed to get summary';
        }
        //summary = data.summary;

    }

    function handleSummaryButton(conversation) {
        //selectedConversation = conversationId;
        if(!summaries[conversation.timestamp]){
            fetchSummary(conversation);
        }
        //fetchSummary(conversationId);
    }

    onMount(async () => {
        await fetchConversations();
    });
    
</script>
{#if $authStore.currentUser}
<body>
    <div class="navbar">
        <a href = "/home" class = "logo">
            <span>SYMPTOQUEST</span>
        </a>
        <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/location"> Map</a></li>
            <li><a href="/summary"> Chat Log </a></li>
            <li><button class = "logout" on:click={authHandlers.logout}>Logout</button></li>
        </ul>
    </div>

    <div class="content">
        <h1>Welcome to the Chat log {email}</h1>
        <p>PLEASE DO NOT RELY ON THIS WEBSITE FOR MEDICAL TREATMENT! IF YOU ARE FEELING UNWELL, CONSULT WITH A MEDICAL PROFESSIONAL.</p>
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
                        <button on:click={() => handleSummaryButton(conversation)}>Summary</button>
                        {#if summaries[conversation.timestamp]}
                            <div class = "summary">
                                <h2>Summary</h2>
                                <p>{summaries[conversation.timestamp]}</p>
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
    background-color: rgb(9, 160, 9);
    padding: 10px 0px;
    position: fixed; /*place the nav to the very top*/
    width: 100%;
    top: 0; /*this helps the nav go fully to the top*/
    left: 0; 
    display: flex; /*makes the buttons into rows not a list*/
    justify-content: space-between;
    font-weight: bold;   
}
    
.navbar a {
    display: block;
    color: white;
    /*text-align: center;*/
    padding: 14px 20px;
    text-decoration: none;
    margin-left: 40px; /*this helps space out the buttons*/
}
    
.navbar a:hover {
    background-color: #333;
    color: white;
    border-radius: 50px;
}
    
.content {
    padding: 100px;
    text-align: center;
    font-weight: bold;  
}

h1{
    font-weight: bold;
    text-transform: uppercase;
}

.convo-list{
    text-align: left;
}

.conversation{
    border: 5px solid #333;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 20px;
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

body{
    display: flex;
    flex-direction: column;
    min-height: 90vh;
}
    
    
footer {
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0; /*helped moved the footer right in the middle*/
    width: 100%;
    padding: 1rem; /*this helps align the footer nicely. not too low to the screen*/
    background-color: rgb(9, 160, 9);
    color: white;
    font-weight: bold;
}

.logo{
    margin-right: 950px;
}

.logo{
    display: flex;
    color: white;
    /*text-align: center;*/
    padding: 14px 20px;
    text-decoration: none;
    font-size:24px;
    font-weight: bold;
}

.navbar a.logo span:hover {
    color: inherit;
}

.navbar a.logo:hover {
    background-color: transparent;
    color: inherit;
}

.summary{
    font-weight: bold;
}

.logout {
    display: flex;
    color: white;
    padding: 14px 20px;
    text-decoration: none;
    background-color: rgb(9, 160, 9);
    border: none; 
    border-radius: 20px; 
    cursor: pointer; 
    font-weight: bold; 
    margin: 0;
    height: 100%;
    font-size: 16px;
    margin-left: 50px;
}

.logout:hover {
    background-color: #333;
    color: white;
    border-radius: 50px;
    height: auto;
}    
</style>