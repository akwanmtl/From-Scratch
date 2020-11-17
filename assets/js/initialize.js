// Declare the different 'Pages'
var loginEl = document.getElementById("login"); // Login page
var navbarEl = document.getElementById("nav-bar"); // nav bar
var homeEl = document.getElementById("homepage"); // home page
var categorySelectionEl = document.querySelector("#categorySelection"); // Page with cuisine buttons 
var categoryEl = document.querySelector("#category"); // Page with list of recipes
var recipeEl = document.querySelector("#recipe"); // Page with recipe
var getCookingEl = document.getElementById("getCooking"); // Page Let's cook it
var profileEl = document.getElementById("profile"); // Profile page

// Declaring the current user div
var currentUser = document.getElementById("current-user");

// function that will switch between pages
function toPage(page){
    categoryEl.classList.add("hide");
    categorySelectionEl.classList.add("hide");
    recipeEl.classList.add("hide");
    getCookingEl.classList.add("hide");
    homeEl.classList.add("hide");
    profileEl.classList.add("hide");
    loginEl.classList.add("hide");

    location.href = "#";
    page.classList.remove("hide");
}

/*****Retrieve local storage*****/
var user; 
var userStorage;

// Checks to see if the user wanted to be remembered. If yes, goes straight to the home page
if(localStorage.getItem("login")) {
    if(localStorage.getItem("login")!==""){
        
        // loginEl.classList.add("hide");
        // homeEl.classList.remove("hide");
        navbarEl.classList.remove("hide");
        toPage(homeEl);
        loadUser(localStorage.getItem("login"));
    }
}
else{
    toPage(loginEl);
    localStorage.setItem("login","");
}

// load the user 
function loadUser(username){
    user = username;
    currentUser.textContent = username;
    userStorage = JSON.parse(localStorage.getItem(username));   
    getStats();
}

// get the statistics of that user
function getStats(){
    var cookingHistory = userStorage.cookingHistory;
    var numCooking = 0;
    var thisMonth = 0;
    for(var i = 0; i < cookingHistory.length; i++){
        console.log(i, cookingHistory[i].comment)
        for(var j = 0; j <cookingHistory[i].comment.length;j++){
            numCooking++;
            var current = moment().format("YYYY-MM");
            var day = cookingHistory[i].comment[j].date;
            if(current === day.slice(0,7)) thisMonth++;
            
            // var current = moment().format("YYYY-MM-D");
            // if(current === day) thisMonth++;
        }
    }
    document.getElementById("overall").textContent = numCooking;
    document.getElementById("monthly").textContent = thisMonth;
}


// function that initializes a new user
function signInInitialize(username, password){
    if(!localStorage.getItem(username)){
        userStorage = {
            user: username,
            password: password,
            savedHistory : [],
            cookingHistory: []
        }
        user = username;
        localStorage.setItem(username, JSON.stringify(userStorage));
    }
    else{
        user = username;
        userStorage = JSON.parse(localStorage.getItem(username));
    }
}

/**********Login page section*********/

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


var logout = document.getElementById("logout"); // to be moved

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
        currentUser.textContent = usernameSignup.value;
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
});

//cancels the signup
cancelSignup.addEventListener("click",function(){
    $('#signup-modal').modal("hide");
});
