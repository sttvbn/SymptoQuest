<div class="navbar">
  <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About Us</a></li>
      <li><a href="/checker">Check up</a></li>
      <li><a href="/map"> Find a Office</a></li>
      <li><a href="/login">Login/Sign up</a></li>
  </ul>
</div>

<body>
    <div class="form-container">
        <form action="/submit-login" class="form-box" id="login-form">
          <h2>Login</h2>
          <label for="login-username">Username</label>
          <input type="text" id="login-username" name="login-username" required>
      
          <label for="login-password">Password</label>
          <input type="password" id="login-password" name="login-password" required>
      
          <button type="submit" class="btn">Login</button>
        </form>
      
        <form action="/submit-signup" class="form-box" id="signup-form">
          <h2>Sign Up</h2>
          <label for="signup-username">Username</label>
          <input type="text" id="signup-username" name="signup-username" required>
      
          <label for="signup-password">Password</label>
          <input type="password" id="signup-password" name="signup-password" required>
      
          <label for="signup-email">Email</label>
          <input type="email" id="signup-email" name="signup-email" required>
      
          <button type="submit" class="btn">Sign Up</button>
        </form>
      </div>
</body>


<style>
  ul {
    list-style-type: none; /*remove the bulletpoint */
    padding: 0; 
    margin: 0; 
    display: flex; /*make them rows instead of list*/
  }
  .navbar{
    font-family: Arial, sans-serif;
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



  body{
    height: 100%;
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
  
  input[type=text], input[type=password], input[type=email] {
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
  
</style>