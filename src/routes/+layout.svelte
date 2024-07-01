<script>
    import {onMount} from 'svelte';
    import {auth} from '../lib/firebase/firebase.client.js';
    import {browser} from '$app/environment';
    import { authStore} from '../stores/authStore';
    import { get } from 'svelte/store';
    import { goto } from '$app/navigation';
    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log(user);
            authStore.update((curr) => {
                return {...curr, isLoading: false, currentUser: user };  
                //error with login because of this section of the code. 
                //if currentUser is changed to true the it will change page
            });

            if (!user && get(authStore).currentUser === null) {
                goto('/login');
            }
        });
        return unsubscribe; 
    });
</script>


<!--possible chance of not needing this container-->
<main class = "mainContainer">


</main>

<slot/>
