<script>
    //purpose of this is to start at the login page. (user needs to login in order to access everything)
    import { onMount } from 'svelte'; 
    import { goto } from '$app/navigation';

    onMount(() => {
        goto('/login');
    });
</script>
  
