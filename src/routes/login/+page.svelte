<script>
  import { authHandlers, authStore } from "../../stores/authStore.js"; 
  let register = true; //this should set the login part. If switched to true then it will changed to sign up part
  let email = ''; 
  let password = '';
  let confirmPassword = ''; 
  let errorMessage = '';
  let message = '';
  let firstname = ''; 
  let lastname = ''; 

  async function handlelogin(){
    //this part of the if statement checks of the form is empty
      if (!email || !password) {
          errorMessage = 'Please fill in all required fields.';
          resetmessage();
          return; 
      }

      //login logic
      try {
        await authHandlers.login(email, password);
        message = 'Login Successful.';
        resetmessage();

        window.location.href = '/home';
      } catch (err) {
        errorMessage = 'Login Invalid. Please try again.';
        resetmessage();
        return;
      }

      function resetmessage(){
        setTimeout(() => {
          errorMessage = '';
          message = '';
        }, 5000);
        
      }

      //this should direct the user to the about page once user have logged in
      //if ($authStore.currentUser) {
        //window.location.href = '/about';
      //}
    }

    async function handlesignup(){
      if (!firstname || !lastname || !email || !password || !confirmPassword || (register && !confirmPassword)) {
          errorMessage = 'Please fill in all required fields.'
          resetmessage();
          return; 
      }

      if (password !== confirmPassword) {
        errorMessage = "Passswords doesn't match. Please try again.";
        resetmessage();
        return;
      }
      else {
        try 
        {
          await authHandlers.signup(email, password, firstname, lastname);
          message = 'Sign up Sucessful. Please login again.'
          firstname = ''; 
          lastname = '';
          email = '';
          password = ''; 
          confirmPassword = '';
          resetmessage();
        } catch (err) {
          console.log("Sign Up Error. Please try again.", err)
          errorMessage = "Sign Up Error. Please try again."; 
          resetmessage();
          return;
        }
      }
      function resetmessage(){
        setTimeout(() => {
          errorMessage = '';
          message = '';
        }, 5000);
      }
      
    }
</script>

<body>
  {#if register}
    <div id = "login-form" class = "form-container">
      <form class="form-box" id="login-form">
        <h2>Login</h2>
        <label for="login-username">Email</label>
        <input bind:value={email} type="text" id="login-email" name="login-email" required>
    
        <label for="login-password">Password</label>
        <input bind:value={password} type="password" id="login-password" name="login-password" required>
        
        <button type="submit" class="btn" on:click={handlelogin}>Login</button>
        <button type= "button" class = "toggle-login" on:click={() => { register = false;}} on:keydown={() => {}}>Don't have an account?<p>Sign Up</p></button>
        {#if errorMessage}
          <p class = "error">{errorMessage}</p>
          {/if}
          {#if message}
          <p class = "success">{message}</p>
          {/if}
      </form>
    </div>
    {:else}    
    <div id = "signup-form" class = "form-container">
      <form class="form-box" id="signup-form">
        <h2>Sign Up</h2>
        <label for="first-name">First Name</label>
        <input bind:value={firstname} type="text" id="first-name" name="first-name" required>

        <label for="last-name">Last Name</label>
        <input bind:value={lastname} type="text" id="last-name" name="last-name" required>
        
        <label for="signup-username">Email</label>
        <input bind:value={email} type="text" id="signup-username" name="signup-username" required>
    
        <label for="signup-password">Password</label>
        <input bind:value={password} type="password" id="signup-password" name="signup-password" required>
    
        <label for="confirmed-password">Confirm Password</label>
        <input bind:value={confirmPassword} type="password" id="confirmed-password" name="confirmed-password" required>

        <button type="submit" class="btn" on:click={handlesignup}>Sign Up</button>
        <button type ="button" class = "toggle-signup" on:click={() => { register = true;}} on:keydown={() => {}}>Already have an account?<p>Login</p></button>
        {#if errorMessage}
          <p class = "error">{errorMessage}</p>
          {/if}
          {#if message}
          <p class = "success">{message}</p>
          {/if}
      </form>
    </div>
    {/if}
</body>


<style>
  body{
    height: 100vh;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f2f2f2;
  }
  
  .form-container {
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .form-box {
    padding: 20px;
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    width: 300px;
  }
  
  input[type=text], input[type=password]/*, input[type=email]*/ {
    width: 100%;
    padding: 15px;
    margin: 10px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  .btn {
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
  }
  
  .btn:hover {
    opacity:0.8;
  }
  
  h2 {
    text-align: center;
  }

  .toggle-login{
    border: none;
    background-color: transparent;
    cursor: pointer; 
    display: flex;
    align-items: center;
    text-decoration: underline;
  }
  .toggle-signup{
    border: none;
    background-color: transparent;
    align-items: center;
    cursor: pointer; 
    display: flex;
    text-decoration: underline;
  }

  .error {
    color: red; 
    text-align: center;
  }

  .success {
    color: green;
    text-align: center;
  }
  
</style>