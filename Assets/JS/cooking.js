var cookBtn = document.getElementById("cook-it");
var recipeImageCook = document.getElementById("recipe-image-cooking");
var recipeNameCook = document.getElementById("recipe-name-cooking");
var procedureCook = document.getElementById("procedure");
var steps = document.getElementById("steps");

var checkboxIngredients = document.getElementsByClassName("ingredients-box");

// these will be global variables
// var recipeMeal;
// var recipeIngredients;
// var recipeInstructions; 

function loadCook (){
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

    
    console.log(recipeIngredients)
    for(var i = 0; i < recipeIngredients.length-1; i++){
        var ingredientCheck = document.createElement("input");
        ingredientCheck.setAttribute("type","checkbox");
        ingredientCheck.setAttribute("id","box-"+i);
        ingredientCheck.classList.add("ingredients-box")
        var ingredientLabel = document.createElement("label");
        ingredientLabel.setAttribute("for","box-"+i);
        ingredientLabel.textContent = recipeIngredients[i];
        steps.appendChild(ingredientCheck);
        steps.appendChild(ingredientLabel);
        steps.appendChild(document.createElement("br"));

        //checks whether all checkboxes have been checked
        ingredientCheck.addEventListener("change", function(){
            if(this.checked){
                this.nextElementSibling.classList.add("strike");
            }
            else{
                this.nextElementSibling.classList.remove("strike");
            }
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

    for(var i = 0; i < recipeInstructions.length; i++){
        var instructionCheck = document.createElement("input");
        instructionCheck.setAttribute("type","checkbox");
        instructionCheck.setAttribute("id","box-"+i);
        instructionCheck.classList.add("ingredients-box")
        var instructionLabel = document.createElement("label");
        instructionLabel.classList.add("label-instructions")
        instructionLabel.setAttribute("for","box-"+i);
        instructionLabel.textContent = recipeInstructions[i];
        steps.appendChild(instructionCheck);
        steps.appendChild(instructionLabel);
        steps.appendChild(document.createElement("br"));
        if(i != 0) instructionCheck.disabled = true;
        if(i == 0) instructionLabel.classList.add("label-active");

        
        instructionCheck.addEventListener("change", function(){
            var boxId = this.getAttribute("id");
            var num = parseInt(boxId.slice(4,recipeInstructions.length)) + 1;
            console.log("num",num);
            this.disabled = true;
            
            this.nextElementSibling.classList.remove("label-active"); 
            this.nextElementSibling.classList.add("strike"); 

            if (num < recipeInstructions.length){
                document.getElementById("box-"+num).disabled = false;
                document.getElementById("box-"+num).nextElementSibling.classList.add("label-active");
            }
            else{
                console.log("done");//modal?
                $("#review-modal").modal("show");
            }
        });
    }

}

cookBtn.addEventListener("click",function(){
    loadCook();
    recipeEl.classList.add("hide");
    getCookingEl.classList.remove("hide");
});



var ratingValue = 0;
$(".rating-star").click(function(){
    console.log($(this).attr("data-star"))
    if(ratingValue == $(this).attr("data-star")){
        $(".rating-star").removeClass("checked");
        ratingValue = 0;
    }
    else{
        ratingValue = $(this).attr("data-star");
        for(var i = 1; i <= 5; i++){
            if(i <= ratingValue){
                $("#star-"+i).addClass("checked");
            }
            else{
                $("#star-"+i).removeClass("checked");
            }
        }
    }
});
  
$("#save-review").click(function(event){
    event.preventDefault();
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
    console.log("saving");

    if (userStorage.cookingHistory.length == 0){
        userStorage.cookingHistory[0] = history;
    }
    else {
        var index = -1;
        for(var i = 0; i < userStorage.cookingHistory.length; i++){
            if(userStorage.cookingHistory[i].name == recipeMeal){
                index = i;
                break;
            }
        }
        if(index != -1){
            var commentNew =  history.comment[0];
            console.log(userStorage.cookingHistory[index].comment);
            userStorage.cookingHistory[index].comment.unshift(commentNew);
            userStorage.serving = history.serving;
            var temp = userStorage.cookingHistory.splice(index,1)[0];
            console.log("removed", temp);
            console.log("removed", userStorage.cookingHistory);

            userStorage.cookingHistory.unshift(temp);
            console.log(userStorage);
        }
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
    
    localStorage.setItem(user,JSON.stringify(userStorage));
    $("#review-modal").modal("hide");

    reset();

    getCookingEl.classList.add("hide");
    categorySelectionEl.classList.remove("hide");

});

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


// Viewing saved history

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

        // card.appendChild(row);

        row.setAttribute("data-meal",list[counterRecipe].name);
        // getRecipe(list[i].strMeal);
        
        row.addEventListener("click",function(event){
            // console.log(this.getAttribute("data-meal"));
            showRecipe(this.getAttribute("data-meal"));
        });

        recipeList.appendChild(row);
        counterRecipe++;
    }

    moreBtn.classList.add("hide");
    //Changed the order *****
    categorySelectionEl.classList.add("hide");
    categoryEl.classList.remove("hide");
    
}
// view cooking history

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

        // card.appendChild(row);

        row.setAttribute("data-meal",list[counterRecipe].name);
        // getRecipe(list[i].strMeal);
        
        row.addEventListener("click",function(event){
            showRecipe(this.getAttribute("data-meal"));
        });

        recipeList.appendChild(row);
        counterRecipe++;
    }
    
    moreBtn.classList.add("hide");
    //Changed the order ****
    categorySelectionEl.classList.add("hide");
    categoryEl.classList.remove("hide");
    
}

var savedHistoryEl = document.getElementById("saved-history");

savedHistoryEl.addEventListener("click",showSavedForLater);

// Viewing cooking history

var cookingHistoryEl = document.getElementById("cooking-history");

cookingHistoryEl.addEventListener("click",loadCookHistory);