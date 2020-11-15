// Declaring div elements in the webpage
var loginEl = document.getElementById("login");
var homeEl = document.getElementById("homepage");
var navbarEl = document.getElementById("nav-bar");

// Declaring buttons of the login/signup page
var loginBtn = document.getElementById("login-button");
var signUpBtn = document.getElementById("sign-up");

// Declaring the elements of the login modal
var submitLogin = document.getElementById("login-form");
var usernameLogin = document.getElementById("username-login");
var passwordLogin = document.getElementById("password-login");
var rememberLogin = document.getElementById("remember-login");
var errorLogin = document.getElementById("error-login");
var cancelLogin = document.getElementById("login-cancel");

// Declaring the elements of the signup modal
var submitSignup = document.getElementById("signup-form");
var usernameSignup = document.getElementById("username-signup");
var passwordSignup = document.getElementById("password-signup");
var passwordConfirmSignup = document.getElementById("password-confirm-signup");
var rememberSignup = document.getElementById("remember-signup");
var errorSignup = document.getElementById("error-signup");
var cancelSignup = document.getElementById("signup-cancel");

var logout = document.getElementById("logout");

// Checks to see if the user wanted to be remembered. If yes, goes straight to the home page
if(localStorage.getItem("login")) {
    if(localStorage.getItem("login")!==""){
        loadUser(localStorage.getItem("login"));

        loginEl.classList.add("hide");
        homeEl.classList.remove("hide");
        navbarEl.classList.remove("hide");
    }
}

function loadUser(username){
    user = username;
    userStorage = JSON.parse(localStorage.getItem(username));   
    getStats();
}

function getStats(){
    var cookingHistory = userStorage.cookingHistory;
    var numCooking = 0;
    var thisMonth = 0;
    for(var i = 0; i < cookingHistory.length; i++){
        console.log(i, cookingHistory[i].comment)
        for(var j = 0; j <cookingHistory[i].comment.length;j++){
            numCooking++;
            console.log("hellow");
            var current = moment().format("YYYY-MM");
            // var current = moment().format("YYYY-MM-DD");
            var day = cookingHistory[i].comment[j].date;
            if(current === day.slice(0,7)) thisMonth++;
            // if(current === day) thisMonth++;
        }
    }
    document.getElementById("overall").textContent = numCooking;
    document.getElementById("monthly").textContent = thisMonth;
}

// The following functions apply if the user is in the login/signup page

// When the user clicks on login button, it opens the login modal
loginBtn.addEventListener("click",function(){
    
    // The modal will be shown
    // When the modal is hidden, resets the values
    $('#login-modal').modal({
        onHide:function(){
            errorLogin.classList.remove("visible");
            errorLogin.textContent = "";
            usernameLogin.value = "";
            passwordLogin.value = "";
            rememberLogin.checked = false;  
        }
    }).modal("show");
});

// When the user clicks on sign up button, it opens the signup modal
signUpBtn.addEventListener("click",function(){

    // The modal will be shown
    // When the modal is hidden, resets the values
    $('#signup-modal').modal({
        onHide:function(){
            errorSignup.classList.remove("visible");
            errorSignup.textContent = "";
            usernameSignup.value = "";
            passwordSignup.value = "";
            passwordConfirmSignup.value = "";
            rememberSignup.checked = false;  
        }
    }).modal("show");
});

// When the user submits the login modal form
submitLogin.addEventListener("submit",function(event){
    
    event.preventDefault();
    
    //Validates whether the form is completed properly

    //username is blank
    if(usernameLogin.value===""){
        errorLogin.classList.add("visible");
        errorLogin.innerText = "Please enter a username";
    }
    // username does not exist in the local storage
    else if(!localStorage.getItem(usernameLogin.value)){
        errorLogin.classList.add("visible");
        errorLogin.textContent = "Either username or password is incorrect";
    }
    // password is incorrect
    else if (JSON.parse(localStorage.getItem(usernameLogin.value)).password !== passwordLogin.value){
        errorLogin.classList.add("visible");
        errorLogin.textContent = "Either username or password is incorrect";
    }

    // when everything is good
    else{
        //if the user wants to keep signed in the next time they revisit
        if(rememberLogin.checked){
            localStorage.setItem("login",usernameLogin.value);
        } 

        //loads the user
        //userStorage = localStorage.getItem(usernameLogin.value);   
        loadUser(usernameLogin.value);
        // getStats();

        // hides modal
        $('#login-modal').modal("hide");
        // goes to the home page
        loginEl.classList.add("hide");
        homeEl.classList.remove("hide");
        navbarEl.classList.remove("hide");
    }
});

// When the user submits the signup modal form
submitSignup.addEventListener("submit",function(event){
    event.preventDefault();

    //Validates whether the form is completed properly

    // username is blank
    if(usernameSignup.value===""){
        errorSignup.classList.add("visible");
        errorSignup.innerText = "Please enter a username";
    }
    // username already exists in local storage
    else if(localStorage.getItem(usernameSignup.value)){
        errorSignup.classList.add("visible");
        errorSignup.textContent = "Username already exists";
    }
    // password is blank
    else if (passwordSignup.value ===""){
        errorSignup.classList.add("visible");
        errorSignup.innerText = "Please enter a password";
    }
    //confirm password is different
    else if(passwordSignup.value !== passwordConfirmSignup.value){
        errorSignup.classList.add("visible");
        errorSignup.innerText = "Your confirmation password does not match";
    }
    //When all is good
    else{
        //if the user wants to keep signed in the next time they revisit
        if(rememberSignup.checked){
            console.log("checked!!")
            localStorage.setItem("login",usernameSignup.value);
        }
        //sets up the new user
        signInInitialize(usernameSignup.value, passwordSignup.value);
        getStats();
        
        //hides the modal
        $('#signup-modal').modal("hide");
        //goes to the homepage
        loginEl.classList.add("hide");
        homeEl.classList.remove("hide");
        navbarEl.classList.remove("hide");
    }
});

//cancels the login
cancelLogin.addEventListener("click",function(){
    $('#login-modal').modal("hide");
})

//cancels the signup
cancelSignup.addEventListener("click",function(){
    $('#signup-modal').modal("hide");
})


logout.addEventListener("click",function(){
    localStorage.setItem("login","");
    
    homeEl.classList.add("hide");
    navbarEl.classList.add("hide");
    // will need to hide everything else!!!!
    
    loginEl.classList.remove("hide");
})