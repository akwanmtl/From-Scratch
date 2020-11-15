//Declare the global variable for the username and the user object
var user; 
var userStorage;

// signInInitialize("username", "password");

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

