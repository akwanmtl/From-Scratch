
/*****This section for when the user starts picking a new recipe*****/

var countriesBox = document.getElementById("countries-box"); // Div for the buttons of cuisine
var recipeList = document.getElementById("recipe-list"); // Div for list of up to 5 recipes
var recipeListText = document.getElementById("list-text"); // title of the list

// Might want to move this to another section
var historyList = document.getElementById("history-list"); // Div for list of cooked recipes
var savedLaterList = document.getElementById("saved-later-list") // Div for list of saved recipes


var moreBtn = document.getElementById("moreRecipes"); // Button to show more recipes
var backBtn = document.getElementById("backToCountries"); // Buttons to go back to the list of cuisines

var buttonsRecipes = document.getElementById("buttonsRecipes");
var buttonsHistory = document.getElementById("buttonsHistory");

// List of cuisine + Surpise Me!
var countriesList = ["American","British","Canadian","Chinese","Dutch","Egyptian","French","Indian","Irish","Italian","Jamaican","Japanese","Kenyan","Malaysian","Mexican","Moroccan","Polish","Russian","Spanish","Thai","Tunisian","Turkish","Vietnamese","Surprise Me!"];

// Declare global variables to go through the recipes of a cuisine
var list;
var counterRecipe = 0;

initializeCountries(); // Initialize the list of countries, do this at the beginning

// Creates the buttons and appends it to the div
function initializeCountries(){
   
    for(var i = 0; i < countriesList.length; i++){
        var countryBtn = document.createElement("button"); 

        countryBtn.classList.add("ui", "button", "large"); 
        countryBtn.setAttribute("data-country",countriesList[i]);
        countryBtn.textContent = countriesList[i];

        countryBtn.addEventListener("click", function(){
            getRecipes(this.getAttribute("data-country"));
        });

        countriesBox.appendChild(countryBtn);
    }
}

// Get the list of recipes for that country/cuisine
function getRecipes(country){

//CHANGED
    // categorySelectionEl.classList.add("hide");
    // categoryEl.classList.remove("hide");

    // Get the url for random recipe 
    if(country === "Surprise Me!"){
        var requestUrl = "https://www.themealdb.com/api/json/v1/1/random.php"
    }
    // Get the url for recipes from that country
    else{
        var requestUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?a="+country;
    }
        // fetch the data    
        fetch(requestUrl)
            .then(function(response){
                if(!response.ok){
                    throw new Error("Network error");
                }
                return response.json();
            })
            .then(function(data){
                console.log(data);
                list = shuffle(data.meals); // Shuffle the list of recipes for variety
                console.log("serving", serving)
                counterRecipe = 0; //set the counter to 0
                createRecipeCard(); //Call the function to create the recipe card

                toPage(categoryEl);
                
            })
            .catch(function(err){
                console.log(err)
            });
}

// shuffle array function
function shuffle(arr){
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

// function that creates the list of up to 5 recipes on a page
function createRecipeCard(){
    recipeListText.innerText = "Pick a Recipe"
    recipeList.innerHTML = "";
    var start = counterRecipe; //keeps tracks of the counter - needed if user wants to show more recipes

    //Loop through the recipes - up to 5 times
    while(counterRecipe < Math.min(list.length, 5+start)){

        var row = document.createElement("div");
        row.classList.add("row");

        var colImg = document.createElement("div");
        colImg.classList.add("six", "wide", "column");

        // Create image of the recipe
        var thumbnail = document.createElement("img");
        thumbnail.setAttribute("alt",list[counterRecipe].strMeal);
        thumbnail.setAttribute("src",list[counterRecipe].strMealThumb);
        colImg.appendChild(thumbnail);

        var colTxt = document.createElement("div");
        colTxt.classList.add("ten", "wide", "column");

        var cardBody = document.createElement("h4");
        // Name of recipe
        var cardTitle = document.createElement("h2");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = list[counterRecipe].strMeal;

// Nutrition preview for 4 servings
        var cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = "Nutrition Preview - 4 servings";
        // This uses the api
        previewNutrition(list[counterRecipe].strMeal,cardText);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        colTxt.appendChild(cardBody);

        row.appendChild(colImg);
        row.appendChild(colTxt);

        row.setAttribute("data-meal",list[counterRecipe].strMeal);
        
        // If the 'card' is click, it will call the showRecipe function
        row.addEventListener("click",function(event){
            showRecipe(this.getAttribute("data-meal"));
        });

        recipeList.appendChild(row);
        counterRecipe++;
    }
    // Make the More Recipes button hidden if there are no more recipe for that cuisine
    if (counterRecipe < list.length - 1){
        moreBtn.classList.remove("hide");
    }
    else{
        moreBtn.classList.add("hide");
    }
};

// takes in the recipe name and the element to put the information
function previewNutrition(meal, el){
    getSingleRecipe(meal).then(function(ingredients){
        getNutrition(ingredients).then(function(nutrients){
            nutrientsObj = convertNutrition(nutrients);
            getNutritionPreview(nutrientsObj,4,el);
        });
    });
}

// new get nutrition preview - outputs a table 
function getNutritionPreview(nutrition, serving, el){
    
    var row = document.createElement("table");
    row.classList.add("ui","teal","table");
    var tHead = document.createElement("thead");
    var tHeadRow = document.createElement("tr");
    var tInfoRow = document.createElement("tr");
    tHead.appendChild(tHeadRow);
    tHead.appendChild(tInfoRow);
    row.appendChild(tHead);
    //calories, sat fat, sodium, sugar, protein
    var previewNutrients = [
        {
            name:"calories",
            display:"Calories",
            unit:"",
            dv: false
        },
        {
            name:"satFat",
            display:"Saturated Fat",
            unit:"g",
            dv:20
        },
        {
            name:"sodium",
            display:"Sodium",
            unit:"mg",
            dv:2300
        },
        {
            name:"sugar",
            display:"Sugar",
            unit:"g",
            dv: false
        },
        {
            name:"protein",
            display:"Protein",
            unit:"g",
            dv: false
        }
    ];
    for (var i = 0; i < previewNutrients.length; i++){
        var pName = document.createElement("th");
        pName.textContent = previewNutrients[i].display;
        
        var pAmount = document.createElement("td");
        var amount = nutrition[previewNutrients[i].name];       
        if(amount/4 < 1 && amount/4 > 0){
            pAmount.textContent = (amount/4).toFixed(1) + " " + previewNutrients[i].unit;
        }   
        else{
            pAmount.textContent = Math.round(amount/serving) + " " + previewNutrients[i].unit;
        }      
                        
        if(previewNutrients[i].dv){
            var percent = Math.round(amount/(previewNutrients[i].dv*serving)*100);
            var pPercent = document.createElement("p");
            pPercent.textContent = percent + "%DV";
            pAmount.appendChild(pPercent);
        }
        
        tHeadRow.appendChild(pName);
        tInfoRow.appendChild(pAmount);
    }
    el.appendChild(row);

       
}

// function that will get the information for one recipe - used to see the nutrition preview
function getSingleRecipe(meal){
    
    var requestUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="+meal;
    // return a fetch promise
    return fetch(requestUrl)
        .then(function(response){
            if(!response.ok){
                throw new Error("Network error");
            }
            return response.json()
        })
        .then(function(data){

            var recipe = data.meals[0];
            var food = "";
            
            
            var i = 1;
            // get the list of ingredients delineated with \n
            while(recipe["strIngredient"+i]!=null){
                if(recipe["strIngredient"+i].trim()==="") break;

                var ingredientItem = document.createElement("li"); 
                var ingredient = recipe["strIngredient"+i];
                var amount = recipe["strMeasure"+i];
                ingredientItem.textContent = amount + " " + ingredient;
                food = food.concat(amount + " " + ingredient + "\n");
                
                i++;
            }
            return food; 
        })
        .catch(function(err){
            console.log(err);
        });
}

// function that retrieves the nutritional facts of the ingredients
function getNutrition (ingredients){
        
    var nutritionixUrl = "https://trackapi.nutritionix.com/v2/natural/nutrients"

    // return a fetch promise
    return fetch(nutritionixUrl,{
        method:"POST",
        mode:'cors',
        headers:{
            //"x-app-id":"930ff8d0", // KC's API KEY
            //"x-app-key":"0dd8cb8ed1cc72e3f116ffb344108992", // KC's API KEY
            "x-app-id":"18e9c76c", // AK's API KEY
            "x-app-key":"442fbbe0551eec1c295ae3a72082b9b2", // AK's API KEY
            "x-remote-user-id":0,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "query": ingredients,
            "line_delimited": true
            })
        
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log('nutritional',data);   
        return data.foods;
    })
    .catch(function(err){
        console.log(err);
    });
}

// function that converts the data retrieved from Nutritionix api into something easier to comprehend
// and return an object
function convertNutrition(foods){
    
    // object containing all the nutrition ffor this website
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

    // goes through each ingredient and add the amount for each component
    for (var i = 0; i < foods.length; i++){
        
        nutrientsObj.calories += (foods[i].nf_calories) ? foods[i].nf_calories : 0;
        nutrientsObj.totalFat += (foods[i].nf_total_fat) ? foods[i].nf_total_fat : 0;
        nutrientsObj.satFat += (foods[i].nf_saturated_fat) ? foods[i].nf_saturated_fat : 0;
        
        nutrientsObj.cholesterol += (foods[i].nf_cholesterol) ? foods[i].nf_cholesterol : 0;
        nutrientsObj.sodium += (foods[i].nf_sodium) ? foods[i].nf_sodium : 0;
        nutrientsObj.carbs += (foods[i].nf_total_carbohydrate) ? foods[i].nf_total_carbohydrate : 0;
        nutrientsObj.fiber += (foods[i].nf_dietary_fiber) ? foods[i].nf_dietary_fiber : 0;
        nutrientsObj.sugar += (foods[i].nf_sugars) ? foods[i].nf_sugars : 0;
        nutrientsObj.protein += (foods[i].nf_protein) ? foods[i].nf_protein : 0;

        // for transfat, we need to go to the full nutrients list and find attr_id of 605
        var full_nutrients = foods[i].full_nutrients;
        for (var j = 0; j < full_nutrients.length; j++){
            if(full_nutrients[j].attr_id == 605){
                nutrientsObj.transFat += full_nutrients[j].value;
                break;
            }
        }
    }
    return nutrientsObj;
}

 // Button to show more recipe
moreBtn.addEventListener("click",createRecipeCard); 

// Button to return back to the home page
backBtn.addEventListener("click",function(){
    // categorySelectionEl.classList.remove("hide");
    // categoryEl.classList.add("hide");
    toPage(categorySelectionEl);
});

/*****This section for when the user picked a recipe*****/

// Elements of the page
var recipeTitle = document.getElementById("recipe-name"); 
var recipeImage = document.getElementById("recipe-image");
var nutritionDetails = document.getElementById("nutrition-details");
var ingredientList = document.getElementById("ingredients-list");
var instructionList = document.getElementById("instructions-list");
var numberPeople = document.getElementById("number-serving");

// Buttons of the page
var differentRecipeBtn = document.getElementById("differentRecipe");
var saveBtn = document.getElementById("save");
var cookBtn = document.getElementById("cook-it");

// Global variables that will be stored in localStorage - to avoid having to call the api again
var recipeMeal; // name of the meal
var recipeIngredients; // ingredients 
var recipeInstructions; // instructions
var recipeUrl; //url for the images
var serving = 4; //the number of serving that they changed
var nutrientsObj; //the nutrients

// Objects with the information of the relevant Nutrients
var previewNutrients = [
    {
        name:"calories",
        display:"Calories",
        unit:"",
        dv: false
    },
    {
        name:"totalFat",
        display:"Total Fat",
        unit:"g",
        dv:65
    },
    {
        name:"satFat",
        display:"Saturated Fat",
        unit:"g",
        dv:20
    },
    {
        name:"transFat",
        display:"Trans Fat",
        unit:"g",
        dv:false
    },
    {
        name:"cholesterol",
        display:"Cholesterol",
        unit:"mg",
        dv:300
    },
    {
        name:"sodium",
        display:"Sodium",
        unit:"mg",
        dv:2300
    },
    {
        name:"carbs",
        display:"Carbohydrates",
        unit:"g",
        dv:300
    },
    {
        name:"fiber",
        display:"Fiber",
        unit:"g",
        dv:25
    },
    {
        name:"sugar",
        display:"Suagr",
        unit:"g",
        dv: false
    },
    {
        name:"protein",
        display:"Protein",
        unit:"g",
        dv: false
    }
];

// displays the recipe page
function showRecipe(mealName){

    // recipeEl.classList.remove("hide");
    // location.href = "#";
    // location.href = "#recipe";
    // categoryEl.classList.add("hide");

    recipeMeal = mealName; // assign the name of the recipe
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

            recipeUrl = recipe.strMealThumb; // assign the url

            
            var food = "";
            ingredientList.innerHTML = "";
            var i = 1;
            // get the recipe ingrdients
            while(recipe["strMeasure"+i].trim()!==null){
                if(recipe["strIngredient"+i].trim()==="") break;
                
                var ingredientItem = document.createElement("li"); 
                var ingredient = recipe["strIngredient"+i];
                var amount = recipe["strMeasure"+i];
                ingredientItem.textContent = amount + " " + ingredient;
                food = food.concat(amount + " " + ingredient + "\n");
                ingredientList.appendChild(ingredientItem);
                i++;
                if(i > 20) break; //the api only has a maximun of 20 ingredients
            }

            recipeIngredients = food.split("\n"); // assign the ingredients

            // get the nutrition from the ingredients
            getNutrition(food).then(function(nutrients){ // for the api
                // var nutrients = nutritionSample.foods; //when not using api
                //nutritional facts section
                
                nutritionDetails.innerHTML = "";
                nutrientsObj = convertNutrition(nutrients); // assign the nutrition object

                updateNutrition();
                
            }); // for the api

            //showing instructions
            recipeInstructions = [];
            instructionList.innerHTML = "";
            // separate the string retrieved from the api based on . and \n
            var instructions = recipe["strInstructions"].split(".").join("\n").split("\n"); 
            
            for(var i = 0; i < instructions.length; i++){
                var instructionItem = document.createElement("li");
                if(instructions[i].trim().length > 7){
                    instructionItem.textContent = instructions[i].trim()+".";
                    instructionList.appendChild(instructionItem);

                    recipeInstructions.push(instructions[i].trim()+"."); // assign instructions
                }
            }

            toPage(recipeEl);
            
        })
        .catch(function(err){
            console.log(err);
        })
};

// function that will show the nutrition 
function updateNutrition(){
    nutritionDetails.innerHTML = "";
    
    for (var i = 0; i < previewNutrients.length; i++){
                     
        var amount = nutrientsObj[previewNutrients[i].name];                
        
        var nutrientItem = document.createElement("tr");
        nutrientItem.classList.add("center", "aligned");

        var nutrientName = document.createElement("th");
        nutrientName.textContent = previewNutrients[i].display;

        var nutrientInfo = document.createElement("td");
        if(amount/serving < 1 && amount/serving > 0){
            nutrientInfo.textContent = (amount/serving).toFixed(1) + " " + previewNutrients[i].unit;
        }
        else{
            nutrientInfo.textContent = Math.round(amount/serving) + " " + previewNutrients[i].unit;
        }
        

        
        var nutrientDV = document.createElement("td");
        if(previewNutrients[i].dv){
            nutrientDV.textContent = Math.round(amount/serving/previewNutrients[i].dv*100) + "%DV";
        }
       

        nutrientItem.appendChild(nutrientName);
        nutrientItem.appendChild(nutrientInfo); 
        nutrientItem.appendChild(nutrientDV);             
        nutritionDetails.appendChild(nutrientItem);
        
    }
}

// if user changes the number of serving, it will update the nutritional facts accordingly
numberPeople.addEventListener("change",function(){
    // if user enters float, round up to a max of 20
    if(this.value%1!=0){
        this.value = (Math.ceil(this.value) > 20)? 20: Math.ceil(this.value);
        serving = this.value;
        updateNutrition();
    }
    // if user enters something less than 1, set to 1
    else if(this.value < 1){
        this.value = 1;
        serving = 1;
        updateNutrition();
    }
    // if user enters something more than 20, set to 20
    else if(this.value > 20){
        this.value = 20;
        serving = 20;
        updateNutrition();
    }
    // set to the number that the user has entered
    else{
        serving = this.value;
        updateNutrition();
    }
});

// If the user choose different recipe, goes back to previous page
differentRecipeBtn.addEventListener("click",function(){
    numberPeople.value = 4;
    toPage(categoryEl);
});

// if the user clicks on save for later button, it will save the recipe to the saved history and will go back to the main screen
saveBtn.addEventListener("click",function(){
    // object format
    var interested = {
        name: recipeMeal,
        url: recipeUrl,
        ingredients: recipeIngredients,
        instructions: recipeInstructions,
        nutrition: nutrientsObj,
        date: moment().format("YYYY-MM-DD"),
        serving: serving
    }
    // the user does not have anything saved yet, set to the first position
    if (userStorage.savedHistory.length == 0){
        userStorage.savedHistory.unshift(interested);
    }
    else {
        // checks whether the recipe has been saved previously
        var index = -1;
        for(var i = 0; i < userStorage.savedHistory.length; i++){
            if(userStorage.savedHistory[i].name == recipeMeal){
                index = i;
                break;
            }
        }
        // if yes, remove the recipe in the index
        if(index != -1){
            userStorage.savedHistory.splice(index,1);
        }
        //and put it at the beginning of the list
        userStorage.savedHistory.unshift(interested);
    }

    //save to localstorage, using the username as key
    localStorage.setItem(user,JSON.stringify(userStorage));
    

    // recipeEl.classList.add("hide");
    // location.href = "#";
    // location.href = "#category";
    // categoryEl.classList.remove("hide");
    numberPeople.value = 4;
    toPage(categoryEl);

});

/*****This section for when the user starts cooking the recipe*****/

// elements of the cook it page
var recipeImageCook = document.getElementById("recipe-image-cooking");
var recipeNameCook = document.getElementById("recipe-name-cooking");
var procedureCook = document.getElementById("procedure");
var steps = document.getElementById("steps");

// variables used to flag the review modal
var modalOpen = false;
var alreadySaved = false;

// global variable for rating
var ratingValue = 0;



// loads the cook-it page
function loadCook (){
    // create image
    var imageThumbnail = document.createElement("img");
    imageThumbnail.setAttribute("src",recipeUrl);
    imageThumbnail.setAttribute("alt",recipeMeal);

    // image classes
    imageThumbnail.classList.add("ui","centered","large","image");
    recipeImageCook.innerHTML="";
    recipeImageCook.appendChild(imageThumbnail);

    // set recipe name
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
                loadInstructions();  //load the instructions next
            }
        });
    }
}

// function that loads the instructions
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

//when the user clicks on let's cook button
cookBtn.addEventListener("click",function(){
    // recipeEl.classList.add("hide");
    // getCookingEl.classList.remove("hide");
    loadCook();
    toPage(getCookingEl);
});

/*****This section for when the user saves review*****/

// when the user saves a review
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
    // check if it is in the saved history. if it is, remove it
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
    console.log("saving", userStorage.cookingHistory);
    // reset the global variable
    reset();
    getStats();

    toPage(homeEl);
}

// reset global variables for when user saves a review
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


// when the user click on the save in the review modal 
$("#save-review").click(function(event){
    event.preventDefault();
    saveReview();
    alreadySaved = true;
    $("#review-modal").modal("hide");
    // getCookingEl.classList.add("hide");
    // categorySelectionEl.classList.remove("hide");
});


/*****This section for when the user go through their history*****/

// fuction that loads the serving saved for the recipe
function getServing(meal,list){
    for(var i = 0; i < list.length; i++){
        if(list[i].name === meal){
            numberPeople.value = list[i].serving;
            break;
        }
    }

}


function showSavedForLater(){
    recipeListText.innerText = "Saved Recipes"
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
        cardText.textContent = (list[counterRecipe].serving == 1) ? "Nutrition Preview - " + list[counterRecipe].serving + " serving" : "Nutrition Preview - " + list[counterRecipe].serving + " servings"

        // get nutrition preview from the nutrition object saved
        getNutritionPreview(list[counterRecipe].nutrition,list[counterRecipe].serving,cardText);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        colTxt.appendChild(cardBody);

        row.appendChild(colImg);
        row.appendChild(colTxt);


        row.setAttribute("data-meal",list[counterRecipe].name);
        
        row.addEventListener("click",function(event){
            getServing(this.getAttribute("data-meal"),list); //get the serving before loading the recipe
            showRecipe(this.getAttribute("data-meal"));
        });

        // savedLaterList.appendChild(row);
        recipeList.appendChild(row);
        counterRecipe++;
    }

    buttonsRecipes.classList.add("hide");/********NEW LINE******/
    buttonsHistory.classList.remove("hide");/********NEW LINE******/
    toPage(categoryEl);
    
}

// Load User's Cooking History

function loadCookHistory(){

    recipeListText.innerText ="Recently Cooked";
    counterRecipe = 0;
    recipeList.innerHTML = "";
    console.log("loading", userStorage.cookingHistory);
    list = userStorage.cookingHistory;

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
        cardTitle.textContent = list[counterRecipe].name;

        var cardText = document.createElement("div");
        // cardText.textContent = "Notes";
        var comments = list[counterRecipe].comment;
        for(var i = 0; i < comments.length; i++){
            var dateText = document.createElement("h3");
            dateText.setAttribute("style","margin-bottom:5px")
            // var ratingText = document.createElement("p");
            var notesText = document.createElement("p");

            dateText.textContent = comments[i].date;
            // ratingText.textContent = "You gave it "+ comments[i].rating + " stars!";
            notesText.textContent = "Notes:\n" + comments[i].notes;
            cardText.appendChild(dateText);
            // cardText.appendChild(ratingText);
            cardText.appendChild(createStars(comments[i].rating));
            cardText.appendChild(notesText);
        } 

        cardText.setAttribute("style","height:200px; overflow:auto");

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        colTxt.appendChild(cardBody);

        row.appendChild(colImg);
        row.appendChild(colTxt);

        row.setAttribute("data-meal",list[counterRecipe].name);
        
        row.addEventListener("click",function(event){
            getServing(this.getAttribute("data-meal"),list); //get the serving before loading the recipe
            showRecipe(this.getAttribute("data-meal"));
        });

        // historyList.appendChild(row);
        recipeList.append(row);
        counterRecipe++;
    }
    
    buttonsRecipes.classList.add("hide");/********NEW LINE******/
    buttonsHistory.classList.remove("hide");/********NEW LINE******/
    toPage(categoryEl);
    
}

function createStars(num){
    var newDiv = document.createElement("div");
    for(var i = 1; i <= 5; i++){
        var newSpan = document.createElement("span"); //fa fa-star rating-star
        newSpan.classList.add("fa","fa-star");
        if(i <= num){
            newSpan.setAttribute("style","color:orange");
        }
        newDiv.appendChild(newSpan);
    }
    return newDiv;
}

/*********Remaining Navigation button********/

var startCook = document.getElementById("start-cooking");
var savedLaterEl = document.getElementById("saved-history"); 
var cookingHistoryEl = document.getElementById("cooking-history"); 
var backToHome = document.getElementById("backToHome");

// nav bar buttons
var navHome = document.getElementById("go-to-home");
var navSaved = document.getElementById("go-to-saved-history");
var navHistory = document.getElementById("go-to-cooking-history");
console.log(navHistory)
var cancelCook = document.getElementById("cancelCook");

startCook.addEventListener("click",function(){
    toPage(categorySelectionEl);
});

savedLaterEl.addEventListener("click",showSavedForLater);

cookingHistoryEl.addEventListener("click",loadCookHistory);

backToHome.addEventListener("click",function(){
    toPage(homeEl);
});

// nav bar buttons functionality
navSaved.addEventListener("click",showSavedForLater);

navHistory.addEventListener("click",loadCookHistory);

navHome.addEventListener("click",function(){
    toPage(homeEl);
});

cancelCook.addEventListener("click",function(){
    toPage(homeEl);
    reset();
});