<script>
    import { authHandlers, authStore } from "../../stores/authStore";
    import { auth } from '../../lib/firebase/firebase.client';
    import { onMount } from 'svelte'; 
    import { GoogleAuthProvider } from "firebase/auth";

    let email; 
    let map;
    let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
    authStore.subscribe((curr) => {
        console.log('CURR', curr);
        email = curr?.currentUser?.email;
    });

    onMount(() => {
        console.log("API Key:", apiKey);
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            console.log("Google Maps script loaded successfully");
        };

        script.onerror = (error) => {
            console.error("Error loading Google Maps script:", error);
        };

        window.initMap = () => {
            console.log("Initializing map");
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat:-34.397, lng: 150.644},
                zoom: 8,
            });
        };
    });

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
        <h1>WELCOME TO SYMPTOQUEST'S MAP!</h1>
    </div>

    <div id="map"></div>
   

</body>

<footer> 
    <p1> Copyright 2024 SymptoQuest</p1>
</footer>
{:else}
<div>Error....</div>
{/if}


<style>
    #map{
        height: 100vh; 
        width: 100%;
    }

.content {
    padding: 1rem;
    text-align: center;
    max-width: 600px; 
    margin: 5rem auto 1rem auto;
    border-radius: 8px;
    
}

ul {
    list-style-type: none; /*remove the bulletpoint */
    padding: 0; 
    margin: 0; 
    display: flex; /*make them rows instead of list*/
}
.navbar {
    overflow: hidden;
    background-color: #333;
    padding: 10px 20px;
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

html, body{
    height: 100%;
    margin: 0;
}

body{
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    font-family: Arial, sans-serif;
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