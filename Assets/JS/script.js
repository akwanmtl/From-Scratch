// This is an example of how to navigate frome one section to an other
// Instructions:
// Put a "hide" class attribute to the home section, 
// Then eliminate the "hide" attribute in the class to the Category Selection Section,
// open the app in your browser and click on any button
// It will take you to the Next Step, the Category section.

// It is just an example, you can do or use whatever method you think its best for you

var chosenCategoryBtn = document.querySelectorAll(".chosenCategoryBtn");
var categorySelectionEl = document.querySelector("#categorySelection");
var categoryEl = document.querySelector("#category");

function showSelectedCategory() {
    console.log(this.textContent)
    categorySelectionEl.setAttribute("class", "hide container border rounded mt-3 row bg-light mx-auto")
    categoryEl.setAttribute("class", "  container border rounded mt-3 row bg-light mx-auto")
}

chosenCategoryBtn.forEach(element => {
    element.addEventListener("click", showSelectedCategory)
})