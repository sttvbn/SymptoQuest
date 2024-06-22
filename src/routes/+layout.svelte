<script>
    import {onMount} from 'svelte';
    import {auth} from '../lib/firebase/firebase.client.js';
    import { authStore} from '../stores/authStore';
    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log(user);
            authStore.update((curr) => {
                return {...curr, isLoading: false, currentUser: user };  
                //error with login because of this section of the code. 
                //if currentUser is changed to true the it will change page
            });
        });
    });
</script>


<!--possible chance of not needing this container-->
<main class = "mainContainer">


</main>

<slot/>
