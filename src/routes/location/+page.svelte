<script>
    import { authHandlers, authStore } from "../../stores/authStore";
    import { auth } from '../../lib/firebase/firebase.client';
    import { onMount } from 'svelte'; 
    import { GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

    let email; 

    authStore.subscribe((curr) => {
        console.log('CURR', curr);
        email = curr?.currentUser?.email;
    });


    let map;
    let markers = []; // Initialize markers array here
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
    const mapId = import.meta.env.VITE_MAP_ID; 
    let infoWindow;

    // Function to load the Google Maps script
    function loadGoogleMapsScript() {
        return new Promise((resolve, reject) => {
            if (!window.google) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
                script.async = true;
                script.defer = true;
                script.onload = () => resolve();
                script.onerror = (error) => {
                    console.error("Error loading Google Maps", error);
                    reject(error);
                };
                document.head.appendChild(script);
            } else {
                resolve();
            }
        });
    }


    async function initMap() {
        const { Map } = await google.maps.importLibrary("maps");
        map = new Map(document.getElementById('map'), {
            center: { lat: 33.857, lng: -117.890 },
            zoom: 13,
            mapId: mapId
        });

        google.maps.importLibrary("maps");
        google.maps.importLibrary("marker");

        infoWindow = new google.maps.InfoWindow();

        // Initialize search box
        const input = document.getElementById('search-input');
        const searchBox = new google.maps.places.SearchBox(input);

        // Add a button event listener for searching
        document.getElementById('search-button').addEventListener('click', () => {
            google.maps.event.trigger(input, 'focus', {});
            google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
        });

        searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            if(places.length === 0) {
                return; 
            }

            searchPlaces(places);
        });

        // Add a click event listener to place a marker
        map.addListener('click', (event) => {
            placeCustomMarker(event.latLng);
        });
    }

    function searchPlaces(places) {
        clearMarkers();

        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }

            // Create a marker for each place
            const marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            });

            markers.push(marker);

            google.maps.event.addListener(marker, 'click', () => {
                console.log('Marker clicked:', place);
                showInfoWindow(marker, place);
            });

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    }

    function clearMarkers() {
        markers.forEach((marker) => marker.setMap(null));
        markers = [];
    }

    function showInfoWindow(marker, place) {
        console.log('Showing info for place: ', place);
        const contentString = `
            <div>
                <h3>${place.name}</h3>
                <p>${place.formatted_address}</p>
                <p>${place.international_phone_number || 'No phone number available'}</p>
                <p>Rating: ${place.rating || 'No rating available'}</p>
                <p>${place.website ? `<a href="${place.website}" target="_blank">Website</a>` : 'No website available'}</p>
            </div>
        `;
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
    }

    function placeCustomMarker(latLng) {
        clearMarkers();

        const marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: "Custom Location"
        });

        markers.push(marker);

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    showInfoWindow(marker, {
                        name: "Custom Location",
                        formatted_address: results[0].formatted_address,
                        rating: "N/A",
                        international_phone_number: "N/A",
                        website: ""
                    });
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    }

    onMount(async () => {
        onAuthStateChanged(auth, async (currentUser) => { //make sure the authentication is sync with firebase to prevent redirection to login
            if (currentUser) {
                email = currentUser.email;
                try {
                    await loadGoogleMapsScript();
                    initMap();
                } catch (error) {
                    console.error("Error initializing Google Maps:", error);
                }
            }
        })
    });
</script>

{#if $authStore.currentUser}
<body class="page-wrapper">
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
        <h1>WELCOME TO SYMPTOQUEST'S MAP!</h1>
        <p>PLEASE DO NOT RELY ON THIS WEBSITE FOR MEDICAL TREATMENT! IF YOU ARE FEELING UNWELL, CONSULT WITH A MEDICAL PROFESSIONAL.</p>
    </div>

    <div class = "search-container">
        <!--<input id = "search-input" class = "controls" type = "text" placeholder = "Search Box">-->
        <input type = "text" id="search-input" placeholder= "Search for places">
        <button id = "search-button">Search</button>
        <div id = "place-info"></div>
    </div>

    <div id="map"></div>
   

</body>

<footer> 
    <p> Copyright 2024 SymptoQuest</p>
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
    font-weight: bold;
    
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

body{
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    margin: 0;
    padding: 0;
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
    
footer {
    text-align: center;
    padding: 1rem;
    background-color: rgb(9, 160, 9);
    color: white;
    font-weight: bold;
    margin-top: auto;
    flex-shrink: 0;
}

.search-container{
    display: flex;
    justify-content: center;
    margin: 1rem;
}

#search-input{
    border-radius: 8px;
    padding: 0.5rem;
    width: 400px;
}


#search-button{
    border-radius: 20px;
    background-color:rgb(9, 160, 9);
    font-weight: bold;

}

#search-button:hover{
    background-color: #333;
    color: white;
    border-radius: 50px;
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
