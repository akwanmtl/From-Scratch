// Declare the differnet 'Pages'
var categorySelectionEl = document.querySelector("#categorySelection");
var categoryEl = document.querySelector("#category");
var recipeEl = document.querySelector("#recipe");

var countriesBox = document.getElementById("countries-box");
var recipeList = document.getElementById("recipe-list");
var historyList = document.getElementById("history-list");
var savedLaterList = document.getElementById("saved-later-list")

var moreBtn = document.getElementById("moreRecipes");
var backBtn = document.getElementById("backToCountries");

var countriesList = ["American","British","Canadian","Chinese","Dutch","Egyptian","French","Indian","Irish","Italian","Jamaican","Japanese","Kenyan","Malaysian","Mexican","Moroccan","Polish","Russian","Spanish","Thai","Tunisian","Turkish","Vietnamese","Suprise Me!"];

var list;
var counterRecipe = 0;

initializeCountries();

function toPage (page){
    categoryEl.classList.add("hide");
    categorySelectionEl.classList.add("hide");
    recipeEl.classList.add("hide");
    getCookingEl.classList.add("hide");
    homeEl.classList.add("hide");
    profileEl.classList.add("hide");

    page.classList.remove("hide");
}

function initializeCountries(){
   
    for(var i = 0; i < countriesList.length; i++){
        var countryBtn = document.createElement("button"); 
        countryBtn.classList.add("ui", "button", "large"); 
        countryBtn.setAttribute("data-country",countriesList[i]);
        countryBtn.textContent = countriesList[i];
        countryBtn.addEventListener("click", function(){
            console.log("to page that shows 5 recipes");
            getRecipes(this.getAttribute("data-country"));
        });
        countriesBox.appendChild(countryBtn);
        
    }

}



function getRecipes(country){

    categorySelectionEl.classList.add("hide");
    categoryEl.classList.remove("hide");

    if(country === "Surpise Me!"){
        var requestUrl = "https://www.themealdb.com/api/json/v1/1/random.php"
    }
    else{
        var requestUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?a="+country;
    }

        fetch(requestUrl)
            .then(function(response){
                if(!response.ok){
                    throw new Error("Network error");
                }
                return response.json()
            })
            .then(function(data){
                console.log(data)
                list = shuffle(data.meals);
                // var list = data.meals;

                console.log(list);
                counterRecipe = 0;
                createRecipeCard();

                //
                

                
            })
            .catch(function(err){
                console.log(err)
            });

}

function shuffle(arr){
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

console.log(list)




function createRecipeCard(){
    
    recipeList.innerHTML = "";
    console.log(counterRecipe);
    var start = counterRecipe;
    while(counterRecipe < Math.min(list.length, 5+start)){
        // var card = document.createElement("div");
        // card.classList.add("card","m-3");
        var row = document.createElement("div");
        row.classList.add("row");
        var colImg = document.createElement("div");
        colImg.classList.add("six", "wide", "column");
        var thumbnail = document.createElement("img");
        // thumbnail.classList.add("card-img");
        thumbnail.setAttribute("alt",list[counterRecipe].strMeal);
        thumbnail.setAttribute("src",list[counterRecipe].strMealThumb);
        colImg.appendChild(thumbnail);

        var colTxt = document.createElement("div");
        colTxt.classList.add("ten", "wide", "column");
        var cardBody = document.createElement("h4");
        // cardBody.classList.add("card-body");
        var cardTitle = document.createElement("h2");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = list[counterRecipe].strMeal;

        var cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = "Nutrition Preview"
        // This is needed - just comment out to not use up the API
        // getNutritionPreview(list[i].strMeal,cardText);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        colTxt.appendChild(cardBody);

        row.appendChild(colImg);
        row.appendChild(colTxt);

        // card.appendChild(row);

        row.setAttribute("data-meal",list[counterRecipe].strMeal);
        // getRecipe(list[i].strMeal);
        
        row.addEventListener("click",function(event){
            // console.log(this.getAttribute("data-meal"));
            showRecipe(this.getAttribute("data-meal"));
        });

        recipeList.appendChild(row);
        counterRecipe++;
    }
    if (counterRecipe < list.length - 1){
        moreBtn.classList.remove("hide");
    }
    else{
        moreBtn.classList.add("hide");
    }
};

function getNutritionPreview(meal,el){
    getRecipe(meal).then(function(ingredients){
        // el.textContent = ingredients;
        getNutrition(ingredients).then(function(nutrients){

            console.log(nutrients);
            nutrientsObj = convertNutrition(nutrients);
            console.log(nutrientsObj);
            var row = document.createElement("div");
            row.classList.add("row");
            //calories, sat fat, sodium, sugar, protein
            var previewNutrients = [
                {
                    name:"calories",
                    unit:"",
                    dv: false
                },
                {
                    name:"satFat",
                    unit:"g",
                    dv:20
                },
                {
                    name:"sodium",
                    unit:"mg",
                    dv:2300
                },
                {
                    name:"sugar",
                    unit:"g",
                    dv: false
                },
                {
                    name:"protein",
                    unit:"g",
                    dv: false
                }
            ];
            for (var i = 0; i < previewNutrients.length; i++){
                var newDiv = document.createElement("div");
                newDiv.classList.add("col-2");
                var pName = document.createElement("p");
                pName.textContent = previewNutrients[i].name;
                newDiv.appendChild(pName);
                
                var pAmount = document.createElement("p");
                var amount = nutrientsObj[previewNutrients[i].name];                
                pAmount.textContent = Math.round(amount/4) + " " + previewNutrients[i].unit;
                newDiv.appendChild(pAmount);

                if(previewNutrients[i].dv){
                    var percent = (amount/(previewNutrients[i].dv*4)).toFixed(1);
                    var pPercent = document.createElement("p");
                    pPercent.textContent = percent + "%DV";
                    newDiv.appendChild(pPercent);
                }
                
                row.appendChild(newDiv);
            }
            el.appendChild(row);

        });
    });
    
}

function getRecipe(meal){
    var requestUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="+meal;
    return fetch(requestUrl)
        .then(function(response){
            if(!response.ok){
                throw new Error("Network error");
            }
            return response.json()
        })
        .then(function(data){
            console.log(data);

            var recipe = data.meals[0];
            
            var food = "";
            
            var i = 1;
            while(recipe["strMeasure"+i].trim()!==""){
                var ingredientItem = document.createElement("li"); 
                var ingredient = recipe["strIngredient"+i];
                var amount = recipe["strMeasure"+i];
                ingredientItem.textContent = amount + " " + ingredient;
                food = food.concat(amount + " " + ingredient + "\n");
                
                i++;
            }
            // console.log(food);
            // getNutrition(food);
            return food; 
        })
        .catch(function(err){
            console.log(err);
        });
}

function getNutrition (ingredients){
        
    var nutritionixUrl = "https://trackapi.nutritionix.com/v2/natural/nutrients"

    console.log(ingredients)
    return fetch(nutritionixUrl,{
        method:"POST",
        mode:'cors',
        headers:{
            "x-app-id":"930ff8d0", 
            "x-app-key":"0dd8cb8ed1cc72e3f116ffb344108992",
            "x-remote-user-id":0,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "query": ingredients,
            "line_delimited": true
            })
        
    })
    .then(function(response){
        console.log("response2", response);
        return response.json();
    })
    .then(function(data){
        console.log('data',data);   
        return data.foods;
        // convertNutrition(data.foods)
    })
    .catch(function(err){
        console.log(err);
    });
}

function convertNutrition(foods){
    var nutrientsObj = {
        calories: 0,
        totalFat: 0,
        satFat: 0,
        transFat: 0,
        cholesterol: 0,
        sodium: 0,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        protein: 0
    };

    // var calories = 0; //208
    // var totalFat = 0; //204
    // var satFat = 0; //606
    // var transFat = 0; //605
    // var cholesterol = 0; //601
    // var sodium = 0; //307 
    // var carbs = 0; //205
    // var fiber = 0; //291
    // var sugar = 0; //269
    // var protein = 0; //203

    for (var i = 0; i < foods.length; i++){
        // console.log("ingredient#: ",i)
        nutrientsObj.calories += (foods[i].nf_calories) ? foods[i].nf_calories : 0;
        nutrientsObj.totalFat += (foods[i].nf_total_fat) ? foods[i].nf_total_fat : 0;
        nutrientsObj.satFat += (foods[i].nf_saturated_fat) ? foods[i].nf_saturated_fat : 0;
        
        nutrientsObj.cholesterol += (foods[i].nf_cholesterol) ? foods[i].nf_cholesterol : 0;
        nutrientsObj.sodium += (foods[i].nf_sodium) ? foods[i].nf_sodium : 0;
        nutrientsObj.carbs += (foods[i].nf_total_carbohydrate) ? foods[i].nf_total_carbohydrate : 0;
        nutrientsObj.fiber += (foods[i].nf_dietary_fiber) ? foods[i].nf_dietary_fiber : 0;
        nutrientsObj.sugar += (foods[i].nf_sugars) ? foods[i].nf_sugars : 0;
        nutrientsObj.protein += (foods[i].nf_protein) ? foods[i].nf_protein : 0;

        var full_nutrients = foods[i].full_nutrients;
        for (var j = 0; j < full_nutrients.length; j++){
            if(full_nutrients[j].attr_id == 605){
                // console.log("transfat",full_nutrients[j].attr_id);
                // console.log("transfat",full_nutrients[j].value);
                nutrientsObj.transFat += full_nutrients[j].value;
                break;
            }
        }

        // transFat += foods[i].full_nutrients.findIndex(function(element){
        //     return element.attr_id === 605;
        // });

    }

    console.log("calories", nutrientsObj.calories);
    console.log("totalFat", nutrientsObj.totalFat);
    console.log("satFat", nutrientsObj.satFat);
    console.log("sodium", nutrientsObj.sodium);
    console.log("cholesterol", nutrientsObj.cholesterol);
    console.log("carbs", nutrientsObj.carbs);
    console.log("fiber", nutrientsObj.fiber);
    console.log("sugar", nutrientsObj.sugar);
    console.log("protein", nutrientsObj.protein)

    return nutrientsObj;

}

moreBtn.addEventListener("click",createRecipeCard);
backBtn.addEventListener("click",function(){
    categorySelectionEl.classList.remove("hide");
    categoryEl.classList.add("hide");
})

var getCookingEl = document.getElementById("getCooking");

var recipeTitle = document.getElementById("recipe-name");
var recipeImage = document.getElementById("recipe-image");
var nutritionDetails = document.getElementById("nutrition-details");
var ingredientList = document.getElementById("ingredients-list");
var instructionList = document.getElementById("instructions-list");
var numberPeople = document.getElementById("number-serving");

var differentRecipeBtn = document.getElementById("differentRecipe");
var saveBtn = document.getElementById("save");
var cookBtn = document.getElementById("cook-it");

var recipeMeal = "";
var serving = 4;
var previewNutrients = [
    {
        name:"calories",
        unit:"",
        dv: false
    },
    {
        name:"totalFat",
        unit:"g",
        dv:65
    },
    {
        name:"satFat",
        unit:"g",
        dv:20
    },
    {
        name:"transFat",
        unit:"g",
        dv:false
    },
    {
        name:"cholesterol",
        unit:"mg",
        dv:300
    },
    {
        name:"sodium",
        unit:"mg",
        dv:2300
    },
    {
        name:"carbs",
        unit:"g",
        dv:300
    },
    {
        name:"fiber",
        unit:"g",
        dv:25
    },
    {
        name:"sugar",
        unit:"g",
        dv: false
    },
    {
        name:"protein",
        unit:"g",
        dv: false
    }
];

function showRecipe(mealName){

    recipeEl.classList.remove("hide");
    location.href = "#";
    location.href = "#recipe";
    categoryEl.classList.add("hide");

    console.log(mealName);
    recipeMeal = mealName;
    var requestUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="+mealName;
    fetch(requestUrl)
        .then(function(response){
            if(!response.ok){
                throw new Error("Network error");
            }
            return response.json()
        })
        .then(function(data){
            console.log(data);

            var recipe = data.meals[0];
            console.log(recipe);

            //set the recipe name 
            recipeTitle.textContent = recipe.strMeal;

            console.log(recipe.strMealThumb);
            //set the images
            var imageThumbnail = document.createElement("img");
            imageThumbnail.setAttribute("src",recipe.strMealThumb);
            imageThumbnail.setAttribute("alt",recipe.strMeal);
            // image classes
            imageThumbnail.classList.add("ui","centered","large","image");
            recipeImage.innerHTML="";
            recipeImage.appendChild(imageThumbnail);

            recipeUrl = recipe.strMealThumb;

            //get the recipes instructions and nutrients
            var food = "";
            ingredientList.innerHTML = "";
            var i = 1;
            console.log("strMeasure"+i)
            while(recipe["strMeasure"+i].trim()!==null){
                if(recipe["strIngredient"+i].trim()==="") break;
                
                var ingredientItem = document.createElement("li"); 
                var ingredient = recipe["strIngredient"+i];
                var amount = recipe["strMeasure"+i];
                ingredientItem.textContent = amount + " " + ingredient;
                food = food.concat(amount + " " + ingredient + "\n");
                ingredientList.appendChild(ingredientItem);
                i++;
                if(i > 20) break;
            }

            recipeIngredients = food.split("\n");

            //showing instructions
            recipeInstructions = [];
            instructionList.innerHTML = "";
            var instructions = recipe["strInstructions"].split(".");
            for(var i = 0; i < instructions.length; i++){
                var instructionItem = document.createElement("li");
                if(instructions[i].trim().length > 7){
                    instructionItem.textContent = instructions[i].trim()+".";
                    instructionList.appendChild(instructionItem);

                    recipeInstructions.push(instructions[i].trim()+".")
                }
            }

            console.log(instructionItem.textContent)

            getNutrition(food).then(function(nutrients){ // for the api
                // var nutrients = nutritionSample.foods; //when not using api
                //nutritional facts section
                
                nutritionDetails.innerHTML = "";
                console.log(nutrients);
                nutrientsObj = convertNutrition(nutrients);
                console.log(nutrientsObj);

                updateNutrition();
                
            }); // for the api

            // showing instructions
            

            //ADDED PARTS - Keith: moved to beginning of function
            
        })
        .catch(function(err){
            console.log(err);
        })
};


function updateNutrition(){
    nutritionDetails.innerHTML = "";
    for (var i = 0; i < previewNutrients.length; i++){
                     
        var amount = nutrientsObj[previewNutrients[i].name];                
        
        var nutrientItem = document.createElement("li");
    
        nutrientItem.textContent = previewNutrients[i].name + ": " + Math.round(amount/serving) + " " + previewNutrients[i].unit;     
                   
        nutritionDetails.appendChild(nutrientItem);
    }
}

numberPeople.addEventListener("change",function(){
    if(this.value%1!=0){
        
        this.value = (Math.ceil(this.value) > 20)? 20: Math.ceil(this.value);
        serving = this.value;
        updateNutrition();
    }
    else if(this.value < 1){
        this.value = 1;
        serving = 1;
        updateNutrition();
    }
    else if(this.value > 20){
        this.value = 20;
        serving = 20;
        updateNutrition();
    }
    else{
        serving = this.value;
        updateNutrition();
    }
});

differentRecipeBtn.addEventListener("click",function(){
    recipeEl.classList.add("hide");
    categoryEl.classList.remove("hide");
});

saveBtn.addEventListener("click",function(){
    console.log("saving...");
    console.log(recipeMeal);
    console.log(nutrientsObj);
});

//
// Let's Cook Section
//

var cookingHistoryEl = document.getElementById("go-to-cooking-history");
var savedLaterEl = document.getElementById("go-to-saved-later");


var cookBtn = document.getElementById("cook-it");
var recipeImageCook = document.getElementById("recipe-image-cooking");
var recipeNameCook = document.getElementById("recipe-name-cooking");
var procedureCook = document.getElementById("procedure");
var steps = document.getElementById("steps");

var checkboxIngredients = document.getElementsByClassName("ingredients-box");

// variables 
var modalOpen = false;
var alreadySaved = false;

// rating
var ratingValue = 0;


// reset global variables for when user returns or begins "home"
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

function loadCook (){
    var imageThumbnail = document.createElement("img");
    imageThumbnail.setAttribute("src",recipeUrl);
    imageThumbnail.setAttribute("alt",recipeMeal);

    // image classes
    imageThumbnail.classList.add("ui","centered","large","image");
    recipeImageCook.innerHTML="";
    recipeImageCook.appendChild(imageThumbnail);

    recipeNameCook.textContent = recipeMeal;

    procedureCook.textContent = "Pull out the ingredients";

    //sections for the list of ingredients
    steps.innerHTML = "";

    
    // shows the ingredients with checkbox
    for(var i = 0; i < recipeIngredients.length-1; i++){
        // creates the checkbox
        var ingredientCheck = document.createElement("input");
        ingredientCheck.setAttribute("type","checkbox");
        ingredientCheck.setAttribute("id","box-"+i);
        ingredientCheck.classList.add("ingredients-box")
        // creates the label
        var ingredientLabel = document.createElement("label");
        ingredientLabel.setAttribute("for","box-"+i);
        ingredientLabel.textContent = recipeIngredients[i];

        // appends the checkbox, label and a line break to the steps div
        steps.appendChild(ingredientCheck);
        steps.appendChild(ingredientLabel);
        steps.appendChild(document.createElement("br"));

        // when the user clicks on the checkbox or label
        ingredientCheck.addEventListener("change", function(){
            // adds a strike to the current ingredient
            if(this.checked){
                this.nextElementSibling.classList.add("strike");
            }
            // removes a strike to the current ingredient
            else{
                this.nextElementSibling.classList.remove("strike");
            }
            //checks whether all checkboxes have been checked
            if (document.querySelectorAll("input.ingredients-box:checked").length === recipeIngredients.length-1){
            loadInstructions();
            }
        });
    }
}

cookBtn.addEventListener("click",function(){
    recipeEl.classList.add("hide");
    getCookingEl.classList.remove("hide");
    loadCook();
});

function loadInstructions(){
    procedureCook.textContent = "Let's Start Cooking";
    steps.innerHTML = "";

    // shows the instructions with checkbox
    for(var i = 0; i < recipeInstructions.length; i++){
        // creates checkbox
        var instructionCheck = document.createElement("input");
        instructionCheck.setAttribute("type","checkbox");
        instructionCheck.setAttribute("id","box-"+i);
        instructionCheck.classList.add("ingredients-box");
        
        // creates label
        var instructionLabel = document.createElement("label");
        instructionLabel.classList.add("label-instructions")
        instructionLabel.setAttribute("for","box-"+i);
        instructionLabel.textContent = recipeInstructions[i];

        // appends checkbox, label and line break to the steps box
        steps.appendChild(instructionCheck);
        steps.appendChild(instructionLabel);
        steps.appendChild(document.createElement("br"));

        // if it is not the first step, disable
        if(i != 0) instructionCheck.disabled = true;

        // if it is the first step, assign the class active
        if(i == 0) instructionLabel.classList.add("label-active");

        // when the user clicks on the checkbox or label 
        instructionCheck.addEventListener("change", function(){

            // get the id of the checkbox
            var boxId = this.getAttribute("id");
            // get the number
            var num = parseInt(boxId.slice(4,boxId.length)) + 1;
            // set the current step to disabled with a strike
            this.disabled = true;
            this.nextElementSibling.classList.remove("label-active"); 
            this.nextElementSibling.classList.add("strike"); 

            // if there are still more steps
            if (num < recipeInstructions.length){
                // set the next step to active
                document.getElementById("box-"+num).disabled = false;
                document.getElementById("box-"+num).nextElementSibling.classList.add("label-active");
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

$(".rating-star").click(function(){
    //if the user clicks on the same amount of star, removes the rating
    if(ratingValue == $(this).attr("data-star")){
        $(".rating-star").removeClass("checked");
        ratingValue = 0;
    }
    //else, set the star check up to where the user clicked
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



//
// Saving Information
//

var cookHistoryPage = document.querySelector("#cookedHistory")
var savedLaterPage = document.querySelector("#savedLater")

var user; 
var userStorage;

signInInitialize("username", "password");

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

    

}

function showSavedForLater(){

    //display only Save for Later page
    savedLaterPage.classList.remove("hide");

    // hide everything else
    categorySelectionEl.classList.add("hide");
    cookHistoryPage.classList.add("hide");
    categoryEl.classList.add("hide");

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

        savedLaterList.appendChild(row);
        counterRecipe++;
    }

    buttonsRecipes.classList.add("hide");/********NEW LINE******/
    buttonsHistory.classList.remove("hide");/********NEW LINE******/
    homeEl.classList.add("hide");/********NEW LINE******/
    recipeEl.classList.add("hide");/*********NEW LINE*********/
    getCookingEl.classList.add("hide");/*********NEW LINE*********/
    
    
}

// when the user click on the save in the review modal 
$("#save-review").click(function(event){
    event.preventDefault();
    saveReview();
    alreadySaved = true;
    $("#review-modal").modal("hide");
    getCookingEl.classList.add("hide");
    categorySelectionEl.classList.remove("hide");
});


// Load User's Cooking History

function loadCookHistory(){
    counterRecipe = 0;
    historyList.innerHTML = "";
    list = userStorage.cookingHistory;
    console.log(userStorage.cookingHistory)

    // display only Cook History
    cookHistoryPage.classList.remove("hide");

    // hide everything else
    savedLaterPage.classList.add("hide");
    categorySelectionEl.classList.add("hide");
    categoryEl.classList.add("hide");

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
            cookHistoryPage.classList.add("hide");
        });

        historyList.appendChild(row);
        counterRecipe++;
    }
    
    moreBtn.classList.add("hide");
    categorySelectionEl.classList.add("hide");

    // categoryEl.classList.remove("hide");
    
}




// For when the "Save for Later" button clicked

saveBtn.addEventListener("click",function(){
    console.log("saving...");

    var interested = {
        name: recipeMeal,
        url: recipeUrl,
        ingredients: recipeIngredients,
        instructions: recipeInstructions,
        nutrition: nutrientsObj,
        date: moment().format("YYYY-MM-DD"),
        serving: serving
    }
    if (userStorage.savedHistory.length == 0){
        userStorage.savedHistory.unshift(interested);
    }
    else {
        var index = -1;
        for(var i = 0; i < userStorage.savedHistory.length; i++){
            if(userStorage.savedHistory[i].name == recipeMeal){
                index = i;
                break;
            }
        }
        if(index != -1){
            userStorage.savedHistory.splice(index,1);
        }
        userStorage.savedHistory.unshift(interested);
    }

    localStorage.setItem(user,JSON.stringify(userStorage));
    

    recipeEl.classList.add("hide");
    location.href = "#";
    location.href = "#category";
    categoryEl.classList.remove("hide");

});




// When you click saved for later in top menu
savedLaterEl.addEventListener("click",showSavedForLater);

// When you click Cooking History in top menu
cookingHistoryEl.addEventListener("click",loadCookHistory);
