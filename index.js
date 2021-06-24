// Initialise modal
const modal = document.querySelector('.modal'); 

// Using materialise library to initialise modal 
M.Modal.init(modal);

// Initialise materialise select element 
// document.addEventListener('DOMContentLoaded', function() {
//     var elems = document.querySelectorAll('select');
// });

// Event listener on argument scheme selected 
const selectElement = document.querySelector('.browser-default');

// Argument scheme selector
const argumentSchemeSelected = document.getElementById("selectArgumentScheme"); 

// Selecting and revealing forms
const actionSchemeForm = document.getElementById("criticalActionScheme")

selectElement.addEventListener('change', (event) => {
    console.log("Value selected is:");
    console.log(argumentSchemeSelected.value);

    if (argumentSchemeSelected.value === "1") {
        actionSchemeForm.className = "show";
    } else {
        actionSchemeForm.className = "hide"; 
    }
});
