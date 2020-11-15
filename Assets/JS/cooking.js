// Declaring the variables for the elements

var cookingHistoryEl = document.getElementById("cooking-history");
var savedHistoryEl = document.getElementById("saved-history");

// This is the button to start cooking
var cookBtn = document.getElementById("cook-it");

// These are the components of the cooking page
var recipeImageCook = document.getElementById("recipe-image-cooking");
var recipeNameCook = document.getElementById("recipe-name-cooking");
var procedureCook = document.getElementById("procedure");
var steps = document.getElementById("steps");

// variables 
var modalOpen = false;
var alreadySaved = false;

// rating
var ratingValue = 0;

// resets global variables
function reset(){
    recipeMeal = "";
    recipeIngredients = "";
    recipeInstructions = ""; 
    serving = 4;
    recipeUrl = "";
    recipeIngredients = [];
    recipeInstructions = [];
    nutrientsObj = {};
    ratingValue = 0;
    $("#notes").val("");
    $(".rating-star").removeClass("checked");
}

// function that stars to load the cooking application and present the ingredients
function loadCook (){
    // create the image
    var imageThumbnail = document.createElement("img");
    imageThumbnail.setAttribute("src",recipeUrl);
    imageThumbnail.setAttribute("alt",recipeMeal);

    // image classes
    imageThumbnail.classList.add("col");
    recipeImageCook.innerHTML="";
    recipeImageCook.appendChild(imageThumbnail);

    recipeNameCook.textContent = recipeMeal;

    procedureCook.textContent = "Pull out the ingredients";

    //sections for the list of ingredients
    steps.innerHTML = "";

    // shows the ingredients with checkbox
    for(var i = 0; i < recipeIngredients.length-1; i++){
        // creates the checkbox
        var field = document.createElement("div");
        field.classList.add("field");
        var row = document.createElement("div");
        row.classList.add("ui","checkbox");
        var ingredientCheck = document.createElement("input");
        ingredientCheck.setAttribute("type","checkbox");
        ingredientCheck.setAttribute("id","box-"+i);
        ingredientCheck.classList.add("ingredients-box")
        // creates the label
        var ingredientLabel = document.createElement("label");
        ingredientLabel.setAttribute("for","box-"+i);
        // ingredientLabel.classList.add("strikethrough");
        ingredientLabel.textContent = recipeIngredients[i];

        // appends the checkbox, label and a line break to the steps div
        row.appendChild(ingredientCheck);
        row.appendChild(ingredientLabel);
        field.appendChild(row);
        steps.appendChild(field);

        // when the user clicks on the checkbox or label
        ingredientCheck.addEventListener("change", function(){
            
            // adds a strike to the current ingredient
            if(this.checked){
                console.log('mark   ')
                // this.nextElementSibling.classList.add("strikethrough");
                this.nextElementSibling.setAttribute("style","text-decoration: line-through;");
            }
            // removes a strike to the current ingredient
            else{
                // this.nextElementSibling.classList.remove("strikethrough");
                this.nextElementSibling.setAttribute("style","");
            }
            //checks whether all checkboxes have been checked
            if (document.querySelectorAll("input.ingredients-box:checked").length === recipeIngredients.length-1){
            loadInstructions();
            }
        });
    }
}

// replaces ingredients with instructions
function loadInstructions(){
    procedureCook.textContent = "Let's Start Cooking";
    steps.innerHTML = "";

    // shows the instructions with checkbox
    for(var i = 0; i < recipeInstructions.length; i++){

        var field = document.createElement("div");
        field.classList.add("field");
        var row = document.createElement("div");
        row.classList.add("ui","checkbox");
        var instructionCheck = document.createElement("input");
        instructionCheck.setAttribute("type","checkbox");
        instructionCheck.setAttribute("id","box-"+i);
        instructionCheck.classList.add("ingredients-box")
        // creates the label
        var instructionLabel = document.createElement("label");
        instructionLabel.setAttribute("for","box-"+i);
        // ingredientLabel.classList.add("strikethrough");
        instructionLabel.textContent = recipeInstructions[i];

        // appends the checkbox, label and a line break to the steps div
        row.appendChild(instructionCheck);
        row.appendChild(instructionLabel);
        field.appendChild(row);
        steps.appendChild(field);
        // creates checkbox
        // var instructionCheck = document.createElement("input");
        // instructionCheck.setAttribute("type","checkbox");
        // instructionCheck.setAttribute("id","box-"+i);
        // instructionCheck.classList.add("ingredients-box");
        
        // // creates label
        // var instructionLabel = document.createElement("label");
        // instructionLabel.classList.add("label-instructions")
        // instructionLabel.setAttribute("for","box-"+i);
        // instructionLabel.textContent = recipeInstructions[i];

        // // appends checkbox, label and line break to the steps box
        // steps.appendChild(instructionCheck);
        // steps.appendChild(instructionLabel);
        // steps.appendChild(document.createElement("br"));

        // if it is not the first step, disable
        if(i != 0) instructionCheck.disabled = true;

        // if it is the first step, assign the class active
        // if(i == 0) instructionLabel.classList.add("label-active");
        if(i == 0) instructionLabel.setAttribute("style","font-size:24px; line-height:30px");

        // when the user clicks on the checkbox or label 
        instructionCheck.addEventListener("change", function(){

            // get the id of the checkbox
            var boxId = this.getAttribute("id");
            // get the number
            var num = parseInt(boxId.slice(4,boxId.length)) + 1;
            // set the current step to disabled with a strike
            this.disabled = true;
            // this.nextElementSibling.classList.remove("label-active"); 
            // this.nextElementSibling.classList.add("strikethrough"); 
            this.nextElementSibling.setAttribute("style","text-decoration:line-through")

            // if there are still more steps
            console.log("is it done:",num < recipeInstructions.length);
            if (num < recipeInstructions.length){
                // set the next step to active
                document.getElementById("box-"+num).disabled = false;
                // document.getElementById("box-"+num).nextElementSibling.classList.add("label-active");
                document.getElementById("box-"+num).nextElementSibling.setAttribute("style","font-size:24px; line-height:30px");
            }
            
            // else, opens the modal
            else{
                // when the modal is closed, check to see if the comments were saved previously 
                // also has a flag to make sure that it only runs the save review once if needed
                $("#review-modal").modal({
                    onHide: function(){
                        console.log(modalOpen);
                        if(modalOpen){
                            modalOpen = false;
                            if(!alreadySaved){
                                saveReview();
                                alreadySaved = false;
                            }
                        }
                    },
                    onShow: function(){
                        modalOpen = true;
                        console.log(modalOpen);
                    }
                }).modal('show');
            }
        });
    }
}



// when the user clicks on the stars, it will change the rating
$(".rating-star").click(function(event){
    console.log("stars");
    console.log("stars", ratingValue);
    var star = event.target;
    //if the user clicks on the same amount of star, removes the rating
    if(ratingValue == star.getAttribute("data-star")){
        // $(".rating-star").removeClass("checked");
        $(".rating-star").attr("style","color:black");
        ratingValue = 0;
    }
    //else, set the star check up to where the user clicked
    else{
        ratingValue = star.getAttribute("data-star");
        for(var i = 1; i <= 5; i++){
            if(i <= ratingValue){
                // $("#star-"+i).addClass("checked");
                
                $("#star-"+i).attr("style","color:orange");
            }
            else{
                // $("#star-"+i).removeClass("checked");
                $("#star-"+i).attr("style","color:black");
            }
        }
    }
});
  
// function that will save the review into local storage
function saveReview(){

    // creates a new object to be saved
    var history = {
        name: recipeMeal,
        url: recipeUrl,
        ingredients: recipeIngredients,
        instructions: recipeInstructions,
        nutrition: nutrientsObj,
        comment: [{
            rating: ratingValue,
            notes: $("#notes").val(),
            date: moment().format("YYYY-MM-DD")
        }],
        serving: serving
    }

    // if cookingHistory array is empty, assign the object at the first index 
    if (userStorage.cookingHistory.length == 0){
        userStorage.cookingHistory[0] = history;
    }

    // or else
    else {

        // checks if the user has already cooked this recipe before
        var index = -1;
        for(var i = 0; i < userStorage.cookingHistory.length; i++){
            if(userStorage.cookingHistory[i].name == recipeMeal){
                index = i;
                break;
            }
        }
        // if it exists, then add the comment object to the existing one
        if(index != -1){
            var commentNew =  history.comment[0];
            var commentArray = userStorage.cookingHistory[index].comment;
            commentArray.unshift(commentNew);
            userStorage.serving = history.serving;

            var temp = userStorage.cookingHistory.splice(index,1)[0];

            userStorage.cookingHistory.unshift(temp);
            
        }
        // if not, push the history object at the front of the array
        else{
            userStorage.cookingHistory.unshift(history);
        }
    }
    // check if it is in the saved history
    if (userStorage.savedHistory.length != 0){
        for(var i = 0; i < userStorage.savedHistory.length; i++){
            if(userStorage.savedHistory[i].name == recipeMeal){
                userStorage.savedHistory.splice(i,1);
                break;
            }
        }
    }
    
    // save to local storage
    localStorage.setItem(user,JSON.stringify(userStorage));

    // reset the global variable
    reset();

    getCookingEl.classList.add("hide");
    categorySelectionEl.classList.remove("hide");

}

// when the user click on the save in the review modal 
$("#save-review").click(function(event){
    event.preventDefault();
    saveReview();
    alreadySaved = true;
    $("#review-modal").modal("hide");
});

// load the list of recipes that was saved for later
function showSavedForLater(){

    counterRecipe = 0;
    recipeList.innerHTML = "";
    list = userStorage.savedHistory;
    while(counterRecipe < list.length){
        
        var row = document.createElement("div");
        row.classList.add("row");
        var colImg = document.createElement("div");
        colImg.classList.add("six", "wide", "column");
        var thumbnail = document.createElement("img");
        
        thumbnail.setAttribute("alt",list[counterRecipe].name);
        thumbnail.setAttribute("src",list[counterRecipe].url);
        colImg.appendChild(thumbnail);

        var colTxt = document.createElement("div");
        colTxt.classList.add("ten", "wide", "column");
        var cardBody = document.createElement("h4");

        var cardTitle = document.createElement("h2");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = list[counterRecipe].name;

        var cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = "Nutrition Preview";

        // This is needed - just comment out to not use up the API
        // getNutritionPreview(list[i].strMeal,cardText);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        colTxt.appendChild(cardBody);

        row.appendChild(colImg);
        row.appendChild(colTxt);


        row.setAttribute("data-meal",list[counterRecipe].name);
        
        row.addEventListener("click",function(event){
            showRecipe(this.getAttribute("data-meal"));
        });

        recipeList.appendChild(row);
        counterRecipe++;
    }

    buttonsRecipes.classList.add("hide");/********NEW LINE******/
    buttonsHistory.classList.remove("hide");/********NEW LINE******/
    homeEl.classList.add("hide");/********NEW LINE******/
    recipeEl.classList.add("hide");/*********NEW LINE*********/
    categorySelectionEl.classList.add("hide");
    categoryEl.classList.remove("hide");
    
}


// load the list of recipes that was previously cooked
function loadCookHistory(){
    counterRecipe = 0;
    recipeList.innerHTML = "";
    list = userStorage.cookingHistory;
    console.log(userStorage.cookingHistory)

    while(counterRecipe < list.length){
        
        console.log(list[counterRecipe].url)

        var row = document.createElement("div");
        row.classList.add("row");
        var colImg = document.createElement("div");
        colImg.classList.add("six", "wide", "column");
        var thumbnail = document.createElement("img");
        thumbnail.setAttribute("alt",list[counterRecipe].name);
        thumbnail.setAttribute("src",list[counterRecipe].url);
        colImg.appendChild(thumbnail);

        var colTxt = document.createElement("div");
        colTxt.classList.add("ten", "wide", "column");
        var cardBody = document.createElement("h4");

        var cardTitle = document.createElement("h2");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = list[counterRecipe].name;

        var cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = "Notes";
        var comments = list[counterRecipe].comment;
        console.log(comments.length)
        for(var i = 0; i < comments.length; i++){
            var dateText = document.createElement("h5");
            var ratingText = document.createElement("p");
            var notesText = document.createElement("p");

            dateText.textContent = comments[i].date;
            ratingText.textContent = "You gave it "+ comments[i].rating + " stars!";
            notesText.textContent = "Notes:\n" + comments[i].notes;
            cardText.appendChild(dateText);
            cardText.appendChild(ratingText);
            cardText.appendChild(notesText);
        } 

        // This is needed - just comment out to not use up the API
        // getNutritionPreview(list[i].strMeal,cardText);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        colTxt.appendChild(cardBody);

        row.appendChild(colImg);
        row.appendChild(colTxt);

        row.setAttribute("data-meal",list[counterRecipe].name);
        
        row.addEventListener("click",function(event){
            showRecipe(this.getAttribute("data-meal"));
        });

        recipeList.appendChild(row);
        counterRecipe++;
    }
    
    buttonsRecipes.classList.add("hide");/********NEW LINE******/
    buttonsHistory.classList.remove("hide");/********NEW LINE******/
    homeEl.classList.add("hide");/********NEW LINE******/
    recipeEl.classList.add("hide");/*********NEW LINE*********/
    categorySelectionEl.classList.add("hide");
    categoryEl.classList.remove("hide");
    
}

// when you click on the cooking button, goes to the cooking div
cookBtn.addEventListener("click",function(){
    loadCook();
    recipeEl.classList.add("hide");
    getCookingEl.classList.remove("hide");
});

// When you click on the show saved for later button
savedHistoryEl.addEventListener("click",showSavedForLater);

// When you click on the show cooking button
cookingHistoryEl.addEventListener("click",loadCookHistory);

/******New part****/
var startCook = document.getElementById("start-cooking");
// var buttonsRecipes = document.getElementById("buttonsRecipes");
// var buttonsHistory = document.getElementById("buttonsHistory");
var backToHome = document.getElementById("backToHome");

var navHome = document.getElementById("go-to-home");
var navSaved = document.getElementById("go-to-saved-history");
var navHistory = document.getElementById("go-to-cooking-history");

startCook.addEventListener("click",function(){
    
    homeEl.classList.add("hide");
    categorySelectionEl.classList.remove("hide");
})

backToHome.addEventListener("click",function(){
    categoryEl.classList.add("hide");
    homeEl.classList.remove("hide");
});

navSaved.addEventListener("click",showSavedForLater);

navHistory.addEventListener("click",loadCookHistory);

navHome.addEventListener("click",function(){
    categoryEl.classList.add("hide");
    categorySelectionEl.classList.add("hide");
    recipeEl.classList.add("hide");
    homeEl.classList.remove("hide");
});