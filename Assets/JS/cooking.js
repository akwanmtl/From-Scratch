var cookBtn = document.getElementById("cook-it");
var recipeImageCook = document.getElementById("recipe-image-cooking");
var recipeNameCook = document.getElementById("recipe-name-cooking");
var procedureCook = document.getElementById("procedure");
var steps = document.getElementById("steps");

var checkboxIngredients = document.getElementsByClassName("ingredients-box");


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
        steps.appendChild(document.createElement("br"))
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

function loadInstructions(){
    procedureCook.textContent = "Let's Start Cooking";
    steps.innerHTML = "";

    for(var i = 0; i < recipeInstructions.length; i++){
        var instructionCheck = document.createElement("input");
        instructionCheck.setAttribute("type","checkbox");
        instructionCheck.setAttribute("id","box-"+i);
        instructionCheck.classList.add("ingredients-box")
        var instructionLabel = document.createElement("label");
        instructionLabel.setAttribute("for","box-"+i);
        instructionLabel.textContent = recipeInstructions[i];
        steps.appendChild(instructionCheck);
        steps.appendChild(instructionLabel);
        steps.appendChild(document.createElement("br"));
        if(i != 0) instructionCheck.disabled= true;
        instructionCheck.addEventListener("change", function(){
            var boxId = this.getAttribute("id");
            var num = parseInt(boxId.slice(4,recipeInstructions.length)) + 1;
            console.log("num",num);
            this.disabled = true;
            this.nextElementSibling.classList.add("strike"); 
            if (num < recipeInstructions.length){
                document.getElementById("box-"+num).disabled = false;
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

// checkboxIngredients.forEach(function(item){
//     item.addEventListener("change",function(){
//         if (document.querySelectorAll('input.ingredientx-box:checked').length === recipeIngredients.length){
//             console.log("yay");
//         }
//     });
// });


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
        rating: ratingValue,
        notes: $("#notes").val(),
        date: moment().format("YYYY-MM-DD")
    }
    console.log("saving");
    console.log(history);
    $("#review-modal").modal("hide");

    
    getCookingEl.classList.add("hide");
    categorySelectionEl.classList.remove("hide");

});