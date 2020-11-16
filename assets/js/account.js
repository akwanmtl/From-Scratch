
/*********This page has to do with the account*********/

var accoutSettings = document.getElementById("account-settings");
var logout = document.getElementById("logout");

// declaring the elements on the profile page
var exitProfile = document.getElementById("exitProfile");
var editUsernameBtn = document.getElementById("editUsername");
var editPasswordBtn = document.getElementById("editPassword");
var deleteAccountBtn = document.getElementById("deleteAccount");

accoutSettings.addEventListener("click",function(){
    toPage(profileEl);
});

exitProfile.addEventListener("click", function(){
    toPage(homeEl);
});

// Declaring the elements of the user modal
var changeUser = document.getElementById("change-user-form");
var passwordUser = document.getElementById("password-change");
var newUsername = document.getElementById("username-change");
var errorUser = document.getElementById("error-change");
var cancelUser = document.getElementById("change-cancel");

// When the user clicks on change username button, it opens the change username modal
editUsernameBtn.addEventListener("click",function(){
    
    // The modal will be shown
    // When the modal is hidden, resets the values
    $('#user-modal').modal({
        onHide:function(){
            errorUser.classList.remove("visible");
            errorUser.textContent = "";
            passwordUser.value = "";
            newUsername.value = "";
        }
    }).modal("show");
});

// When the user submits the change usernameform
changeUser.addEventListener("submit",function(event){
    
    event.preventDefault();
    
    //Validates whether the form is completed properly

    //password is blank
    if(passwordUser.value===""){
        errorUser.classList.add("visible");
        errorUser.innerText = "Please enter your password";
    }
    // wrong password
    else if(passwordUser.value!==userStorage.password){
        errorUser.classList.add("visible");
        errorUser.textContent = "Incorrect password";
    }
    // username already exists
    else if (localStorage.getItem(newUsername.value)){
        errorUser.classList.add("visible");
        errorUser.textContent = "Username already taken";
    }

    // when everything is good
    else{
        localStorage.removeItem(user);
        user = newUsername.value;
        userStorage.user = user;
        localStorage.setItem("login",user);
        localStorage.setItem(user,JSON.stringify(userStorage));
        currentUser.textContent = user;

        // hides modal
        $('#user-modal').modal("hide");
    }
});


// Declaring the elements of the password modal
var changePassword = document.getElementById("change-password-form");
var currentPassword = document.getElementById("password-current");
var newPassword = document.getElementById("password-new");
var newPasswordConfirm = document.getElementById("password-confirm-change");
var errorPassword = document.getElementById("error-password");
var cancelPassword = document.getElementById("password-cancel");
// When the user clicks on change username button, it opens the change username modal
editPasswordBtn.addEventListener("click",function(){
    
    // The modal will be shown
    // When the modal is hidden, resets the values
    $('#password-modal').modal({
        onHide:function(){
            errorPassword.classList.remove("visible");
            errorPassword.textContent = "";
            currentPassword.value = "";
            newPassword.value = "";
            newPasswordConfirm.value = "";
        }
    }).modal("show");
});

// When the user submits the change usernameform
changePassword.addEventListener("submit",function(event){
    
    event.preventDefault();
    //Validates whether the form is completed properly

    //current password is blank
    if(currentPassword.value===""){
        errorPassword.classList.add("visible");
        errorPassword.innerText = "Please enter your current password";
    }
    // wrong password
    else if(currentPassword.value!==userStorage.password){
        errorPassword.classList.add("visible");
        errorPassword.textContent = "Incorrect password";
    }
    // new password is blank
    else if (newPassword.value===""){
        errorPassword.classList.add("visible");
        errorPassword.textContent = "Please enter your new password";
    }
    // the confirm password does not match
    else if (newPassword.value!==newPasswordConfirm.value){
        errorPassword.classList.add("visible");
        errorPassword.textContent = "Please enter the same password to confirm";
    }

    // when everything is good
    else{
        userStorage.password = newPassword.value;
        localStorage.setItem(user,JSON.stringify(userStorage));
        // hides modal
        $('#password-modal').modal("hide");
    }
});


// Declaring the elements of the delete modal
var deleteAccount = document.getElementById("delete-form");
var deleteUser = document.getElementById("delete-user");
var deletePassword = document.getElementById("delete-password");
var errorDelete = document.getElementById("error-delete");
var cancelDelete = document.getElementById("delete-cancel");
// When the user clicks on change username button, it opens the change username modal
deleteAccountBtn.addEventListener("click",function(){
    
    // The modal will be shown
    // When the modal is hidden, resets the values
    $('#delete-modal').modal({
        onHide:function(){
            errorDelete.classList.remove("visible");
            errorDelete.textContent = "";
            deletePassword.value = "";
            deleteUser.value = "";
        }
    }).modal("show");
});

// When the user submits the delete accoutn form
deleteAccount.addEventListener("submit",function(event){
    
    event.preventDefault();
    //Validates whether the form is completed properly

    //current password is blank
    if(deleteUser.value===""){
        errorDelete.classList.add("visible");
        errorDelete.innerText = "Please enter your username";
    }
    //current password is blank
    else if(deletePassword.value===""){
        errorDelete.classList.add("visible");
        errorDelete.innerText = "Please enter your password";
    }
    // wrong username or password
    else if(deleteUser.value!==userStorage.user || deletePassword.value !== userStorage.password){
        errorDelete.classList.add("visible");
        errorDelete.textContent = "Incorrect username or password";
    }

    // when everything is good
    else{
        
        localStorage.removeItem(user);
        user = "";
        userStorage = {};
        localStorage.setItem("login","");
        // hides modal
        
        $('#delete-modal').modal("hide");
        navbarEl.classList.add("hide");
        toPage(loginEl);
    }
});

//cancels the login
cancelUser.addEventListener("click",function(){
    $('#user-modal').modal("hide");
})

//cancels the signup
cancelPassword.addEventListener("click",function(){
    $('#password-modal').modal("hide");
})

//cancels the signup
cancelDelete.addEventListener("click",function(){
    $('#delete-modal').modal("hide");
});

logout.addEventListener("click",function(){
    localStorage.setItem("login","");
    
    navbarEl.classList.add("hide");
    toPage(loginEl);
});