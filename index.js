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
}