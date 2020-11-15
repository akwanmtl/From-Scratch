var loginBtn = document.getElementById("login-button");
var signUpBtn = document.getElementById("sign-up");

loginBtn.addEventListener("click",function(){
    
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

signUpBtn.addEventListener("click",function(){
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


var submitLogin = document.getElementById("login-form");
var usernameLogin = document.getElementById("username-login");
var passwordLogin = document.getElementById("password-login");
var rememberLogin = document.getElementById("remember-login");
var errorLogin = document.getElementById("error-login");

var cancelLogin = document.getElementById("login-cancel");

var submitSignup = document.getElementById("signup-form");
var usernameSignup = document.getElementById("username-signup");
var passwordSignup = document.getElementById("password-signup");
var passwordConfirmSignup = document.getElementById("password-confirm-signup");
var rememberSignup = document.getElementById("remember-signup");
var errorSignup = document.getElementById("error-signup");

var cancelSignup = document.getElementById("signup-cancel");

var loginEl = document.getElementById("login");
var homeEl = document.getElementById("homepage");
var navbarEl = document.getElementById("nav-bar");

submitLogin.addEventListener("submit",function(event){
    event.preventDefault();
    console.log("username", usernameLogin.value);
    console.log("password", passwordLogin.value);
    console.log("checked", rememberLogin.checked);
    
    if(usernameLogin.value===""){
        console.log('blank')
        errorLogin.classList.add("visible");
        errorLogin.innerText = "Please enter a username";
    }
    else if(!localStorage.getItem(usernameLogin.value)){
        errorLogin.classList.add("visible");
        errorLogin.textContent = "Either username or password is incorrect";
    }
    else if (JSON.parse(localStorage.getItem(usernameLogin.value)).password !== passwordLogin.value){
        errorLogin.classList.add("visible");
        errorLogin.textContent = "Either username or password is incorrect";
    }
    else{
        
        if(rememberLogin.checked){
            localStorage.setItem("login",usernameLogin.value);
        } 

        signInInitialize(usernameLogin.value, passwordLogin.value);

        $('#login-modal').modal("hide");
        loginEl.classList.add("hide");
        homeEl.classList.remove("hide");
        navbarEl.classList.remove("hide");
    }
});

submitSignup.addEventListener("submit",function(event){
    event.preventDefault();
    console.log("username", usernameSignup.value);
    console.log("password", passwordSignup.value);
    console.log("password confirm", passwordConfirmSignup.value);
    console.log("checked", rememberSignup.checked);
    
    if(usernameSignup.value===""){
        console.log('blank')
        errorSignup.classList.add("visible");
        errorSignup.innerText = "Please enter a username";
    }
    else if(localStorage.getItem(usernameSignup.value)){
        errorSignup.classList.add("visible");
        errorSignup.textContent = "Username already exists";
    }
    else if (passwordSignup.value ===""){
        errorSignup.classList.add("visible");
        errorSignup.innerText = "Please enter a password";
    }
    else if(passwordSignup.value !== passwordConfirmSignup.value){
        errorSignup.classList.add("visible");
        errorSignup.innerText = "Your confirmation password does not match";
    }
    else{
        
        if(rememberSignup.checked){
            console.log("checked!!")
            localStorage.setItem("login",usernameSignup.value);
        } 

        signInInitialize(usernameSignup.value, passwordSignup.value);

        $('#signup-modal').modal("hide");
        loginEl.classList.add("hide");
        homeEl.classList.remove("hide");
        navbarEl.classList.remove("hide");
    }
});

cancelLogin.addEventListener("click",function(){
    $('#login-modal').modal("hide");
})

cancelSignup.addEventListener("click",function(){
    $('#signup-modal').modal("hide");
})