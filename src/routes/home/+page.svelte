<script>

    import { authHandlers, authStore } from "../../stores/authStore";
    import { auth } from '../../lib/firebase/firebase.client';

    let email; 
    authStore.subscribe((curr) => {
        console.log('CURR', curr);
        email = curr?.currentUser?.email;
    });

</script>
<!--<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->
{#if $authStore.currentUser}
<body>
    <div class="navbar">
        <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/map"> Find a Office</a></li>
            <li><a href="/GPT"> GPT Beta Test</a></li>
            <li><a href = "#" on:click={authHandlers.logout}>Logout</a></li>
        </ul>
    </div>

    <div class="content">
        <h1>Welcome</h1>
        <p>PLEASE DO NOT RELIE ON THIS WEBSITE FOR MEDICAL TREATMENT! IF YOU'RE FEELING UNWELL, CONSULT WITH A MEDICAL PROFESSIONAL.</p>
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


footer {
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 50%; /*helped moved the footer right in the middle*/
    width: 100;
    padding: 10px 20px; /*this helps align the footer nicely. not too low to the screen*/

}

</style>

