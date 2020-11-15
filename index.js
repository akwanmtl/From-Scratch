var categorySelectionEl = document.querySelector("#categorySelection");
var categoryEl = document.querySelector("#category");
var recipeEl = document.querySelector("#recipe");

var countriesBox = document.getElementById("countries-box");
var recipeList = document.getElementById("recipe-list");

var moreBtn = document.getElementById("moreRecipes");
var backBtn = document.getElementById("backToCountries");

var countriesList = ["American","British","Canadian","Chinese","Dutch","Egyptian","French","Indian","Irish","Italian","Jamaican","Japanese","Kenyan","Malaysian","Mexican","Moroccan","Polish","Russian","Spanish","Thai","Tunisian","Turkish","Vietnamese"];

var list;
var counterRecipe = 0;

initializeCountries();


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


    var requestUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?a="+country;
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

            //get the recipes instructions and nutrients
            var food = "";
            ingredientList.innerHTML = "";
            var i = 1;
            console.log("strMeasure"+i)
            while(recipe["strMeasure"+i].trim()!==""){
                
                var ingredientItem = document.createElement("li"); 
                var ingredient = recipe["strIngredient"+i];
                var amount = recipe["strMeasure"+i];
                ingredientItem.textContent = amount + " " + ingredient;
                food = food.concat(amount + " " + ingredient + "\n");
                ingredientList.appendChild(ingredientItem);
                i++;
                if(i > 20) break;
            }

            instructionList.innerHTML = "";
            var instructions = recipe["strInstructions"].split(".");
            for(var i = 0; i < instructions.length; i++){
                var instructionItem = document.createElement("li");
                if(instructions[i].trim().length > 7){
                    instructionItem.textContent = instructions[i].trim()+".";
                    instructionList.appendChild(instructionItem);
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
            

            //ADDED PARTS
            
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


cookBtn.addEventListener("click",function(){
    recipeEl.classList.add("hide");
    getCookingEl.classList.remove("hide");
});