var chosenCategoryBtn = document.querySelectorAll(".chosenCategoryBtn");
var categorySelectionEl = document.querySelector("#categorySelection");
var categoryEl = document.querySelector("#category");

function showSelectedCategory() {
    console.log(this.textContent)
    categorySelectionEl.setAttribute("class", "hide container offset-2 border rounded mt-3 row bg-light")
    categoryEl.setAttribute("class", " container offset-2 border rounded mt-3 row bg-light")
}

chosenCategoryBtn.forEach(element => {
    element.addEventListener("click", showSelectedCategory)
})