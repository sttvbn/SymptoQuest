<script>
    import { authHandlers, authStore } from "../../stores/authStore";
    import { auth } from '../../lib/firebase/firebase.client';
    import { onMount } from 'svelte'; 
    import { GoogleAuthProvider } from "firebase/auth";
    import { get } from 'svelte/store';


    let email; 
    let map;
    let marker;
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
    const mapId = import.meta.env.VITE_MAP_ID; 
    authStore.subscribe((curr) => {
        console.log('CURR', curr);
        email = curr?.currentUser?.email;
    });

    // Function to load the Google Maps script
    function loadGoogleMapsScript() {
        return new Promise((resolve, reject) => {
            if (!window.google) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);

                script.onload = () => resolve();
                script.onerror = (error) => reject(error);
            } else {
                resolve();
            }
        });
    }

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 33.857, lng: -117.890 },
            zoom: 13,
            mapId: mapId
        });

        // Initialize search box
        const input = document.getElementById('search-input');
        const searchBox = new google.maps.places.SearchBox(input);

        // Add a button event listener for searching
        document.getElementById('search-button').addEventListener('click', () => {
            searchPlaces(searchBox);
        });

        // Add event listener for automatic place selection
        searchBox.addListener('places_changed', () => {
            searchPlaces(searchBox);
        });

        // Add a click event listener to place a marker
        map.addListener('click', (event) => {
            if (marker) {
                marker.setMap(null); // Remove the previous marker
            }

            marker = new google.maps.Marker({
                position: event.latLng,
                map: map,
                title: "User Marker"
            });
        });
    }

    function searchPlaces(searchBox) {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }

        // Clear out the old marker
        if (marker) {
            marker.setMap(null);
        }

        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }

            // Create a marker for each place
            marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            });

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    }

    onMount(async () => {
        const currentUser = get(authStore).currentUser;
        if (currentUser) {
            email = currentUser.email;
            try {
                await loadGoogleMapsScript();
                initMap();
            } catch (error) {
                console.error("Error initializing Google Maps:", error);
            }
        }
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

    <div class = "search-container">
        <input id = "search-input" class = "controls" type = "text" placeholder = "Search Box">
        <button id = "search-button">Search</button>
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