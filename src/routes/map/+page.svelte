<body>
    <div class="navbar">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/checker">Check up</a></li>
            <li><a href="/map"> Find a Office</a></li>
            <li><a href="/login">Login/Sign up</a></li>
        </ul>
    </div>

    <div class="content">
        <h1>Welcome to the Map</h1>
    </div>


</body>

<!--this will be for the map-->
<script>
    import { browser } from '$app/environment';
    import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

    let Map; 
    let Marker;
    let map_object;
    let map_element;

    const initialMapDisplayOptions = {
        zoom: 8, 
        center: { lat: 35, lng: -110},
        mapId: 'SAMPLE_MAP_ID'
    };

    if (browser) {
        ((g) => { var h, a, k, p = 'The Google Maps JavaScript API', c = 'google', l = 'importLibrary', q = '__ib__', m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set(), e = new URLSearchParams(), u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement('script')); e.set('libraries', [...r] + ''); for (k in g) e.set( k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()), g[k] ); e.set('callback', c + '.maps.' + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => (h = n(Error(p + ' could not load.'))); a.nonce = m.querySelector('script[nonce]')?.nonce || ''; m.head.append(a); })); d[l] ? console.warn(p + ' only loads once. Ignoring:', g) : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))); })({
            key: PUBLIC_GOOGLE_MAPS_API_KEY,
            v: 'weekly'
        });
        map_element = document.getElementById('map');

        (async () => {
            ({ Map } = await google.maps.importLibrary('maps'));
            ({ Marker } = await google.maps.importLibrary('marker'));

            map_object = new Map(map_element, initialMapDisplayOptions);
        })();
    }

    let lat;
    let lng;
    function get_current_position() {
        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
        });
    }
    function get_center() {
        const lat_lng_obj = map_object.getCenter();
        ({ lat, lng } = lat_lng_obj.toJSON());
    }
    function set_center() {
        console.log('Setting center to', lat, lng);
        map_object.setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }

    let markerText = 'Hello, World!';
    function create_marker() {
        const marker = new Marker({
            map: map_object,
            position: { lat: parseFloat(lat), lng: parseFloat(lng) },
            title: markerText
        });
    }
</script>

<div id = "map"></div>
<br />
<label for = "lat"> Latitude: <input name = "lat" type = "text" bind:value= {lat} /></label>
<label for = "lng"> Longitude: <input name = "lng" type = "text" bind:value= {lng} /></label>
<br /> <!--br = break-->
<button on:click={() => get_current_position()}>Get Current Position</button>
<button on:click={() => get_center()}>Get Map Center</button>
<button on:click={() => set_center()}>Set Map Center</button>
<br />
<button on:click={() => create_marker()}> Create Marker</button>
<label for ="markerText">Marker text:<input name= "markerText" type = "text" bind:value={markerText}/></label>
<!--code for map ending-->

<footer> 
    <p1> Copyright 2024 SymptoQuest</p1>
</footer>


<style>
    /*this is part of the code is for the map*/
    #map{
        height: 600px;
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

.content {
    padding: 50px;
    text-align: center;

}


footer {
    text-align: center;
    position: bottom;
    bottom: 0;
    left: 50%; /*helped moved the footer right in the middle*/
    width: 100;
    padding: 10px 20px; /*this helps align the footer nicely. not too low to the screen*/

}

</style>