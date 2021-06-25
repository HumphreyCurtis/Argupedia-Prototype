// Initialise modal
const modal = document.querySelector(".modal"); 

// Using materialise library to initialise modal 
M.Modal.init(modal);

// Initialise modal
const modal1 = document.getElementById("modal1"); 

// Using materialise library to initialise modal 
M.Modal.init(modal1);

// Event listener on argument scheme selected 
const selectElement = document.querySelector(".browser-default");

// Argument scheme selector
const argumentSchemeSelected = document.getElementById("selectArgumentScheme"); 

// Selecting and revealing forms
const actionSchemeForm = document.getElementById("criticalActionScheme");


selectElement.addEventListener('change', (event) => {
    console.log("Value selected is:");
    console.log(argumentSchemeSelected.value);

    if (argumentSchemeSelected.value === "1") { // Will need to change to make better 
        actionSchemeForm.className = "show";
    } else {
        actionSchemeForm.className = "hide"; 
    }
});

// Change plus sign for argument 
const form = document.querySelector("form"); 

// Critical aciton scheme parameters 
const casCircumstance = document.querySelector("#casCircumstance"); 
const casAction = document.querySelector("#casAction"); 
const casGoal = document.querySelector("#casGoal"); 
const casValue = document.querySelector("#casAction"); 
const casParent = null; 

form.addEventListener("submit", e => {
    e.preventDefault();
    console.log(casCircumstance.value);
    console.log(casAction.value);
    console.log(casGoal.value);
    console.log(casValue.value);

    db.collection("arguments").add({
        scheme : "critical action scheme", 
        circumstance : casCircumstance.value, 
        action : casAction.value, 
        goal : casGoal.value, 
        value : casValue.value,
        parent : null 
    }); 

    var instance = M.Modal.getInstance(modal); 
    instance.close(); 
    
    form.reset(); 
});

// SETTING UP COUNTER-ARGUMENT

// Initial argument button and text
const initialAddButtonText = document.getElementById("addButtonText");
const initialAddArgumentButton = document.getElementById("initialAddButton");

// Second argument button and text
const secondAddButtonText = document.getElementById("secondAddButtonText");
const secondAddArgumentButton = document.getElementById("secondAddButton");

db.collection("arguments").onSnapshot(function(querySnapshot) {      
    console.log(querySnapshot.size); 
    console.log(querySnapshot.docs.length);
    var numberOfArguments = querySnapshot.docs.length; 

    if (numberOfArguments === 1) {
       initialAddButtonText.className = "hide";
       initialAddArgumentButton.className = "hide";
    }
});

