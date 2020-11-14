var user = "username"; // to be changed with login
var password = "password";
var userStorage;


console.log("before", userStorage);
if(!localStorage.getItem(user)){
    console.log('no user');
    userStorage = {
        user: user,
        password: password,
        savedHistory : [],
        cookingHistory: []
    }
    localStorage.setItem(user, JSON.stringify(userStorage));
}
else{
    userStorage = JSON.parse(localStorage.getItem(user));
}

console.log("after", userStorage);
