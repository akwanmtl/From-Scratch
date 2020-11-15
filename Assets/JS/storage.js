// var user = "username"; // to be changed with login
// var password = "password";
var userStorage;

function signInInitialize(username, password){
    if(!localStorage.getItem(username)){
        console.log('no user');
        userStorage = {
            user: username,
            password: password,
            savedHistory : [],
            cookingHistory: []
        }
        localStorage.setItem(username, JSON.stringify(userStorage));
    }
    else{
        userStorage = JSON.parse(localStorage.getItem(username));
    }
}


// console.log("before", userStorage);
// if(!localStorage.getItem(user)){
//     console.log('no user');
//     userStorage = {
//         user: user,
//         password: password,
//         savedHistory : [],
//         cookingHistory: []
//     }
//     localStorage.setItem(user, JSON.stringify(userStorage));
// }
// else{
//     userStorage = JSON.parse(localStorage.getItem(user));
// }

// console.log("after", userStorage);
