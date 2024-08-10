<script>

    import { authHandlers, authStore } from "../../stores/authStore";
    import { auth } from '../../lib/firebase/firebase.client';

    let email; 
    authStore.subscribe((curr) => {
        console.log('CURR', curr);
        email = curr?.currentUser?.email;
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
        <h1>WELCOME TO SYMPTOQUEST!</h1>
        <p>Our mission is to offer a symptom checker designed for users to utilize for medical needs with AI technology. 
        SymptoQuest aims to help users identify potential medical conditions. Still, please be aware that the purpose of 
        SymptoQuest is designed for educational purposes only and shouldn't be considered a substitute for professional medical advice. 
        Please consult with a qualified healthcare professional for any real medical emergencies or concerns. Thank you.</p>
    </div>
   

</body>

<footer> 
    <p1> Copyright 2024 SymptoQuest</p1>
</footer>
{:else}
<div>Error....</div>
{/if}


<style>

.content {
    padding: 1rem;
    text-align: center;
    max-width: 600px; 
    margin: 5rem auto 1rem auto;
    border-radius: 8px;
    font-weight: bold;
    
}

h1{
    font-size: 50px;
}

p{
    font-size: 25px;
}

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
    padding: 14px 20px;
    text-decoration: none;
    margin-left: 40px; /*this helps space out the buttons*/
}

.navbar a:hover {
    background-color: #333;
    color: white;
    border-radius: 50px;
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