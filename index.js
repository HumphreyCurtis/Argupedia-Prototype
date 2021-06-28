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

// Number of arguments in debate
var numberOfArguments = 0;

const initialAddArgumentButton = document.getElementById("initialAddButton");


selectElement.addEventListener('change', (event) => {
    console.log("Value selected is:");
    console.log(argumentSchemeSelected.value);

    if (argumentSchemeSelected.value === "1") { // Will need to change to make better 
        actionSchemeForm.className = "show";
    } else {
        actionSchemeForm.className = "hide";
    }
});


db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

    // if (numberOfArguments === 1) {
    //    initialAddButtonText.className = "hide";
    //    initialAddArgumentButton.className = "hide";
    // }

    if (numberOfArguments > 0) {
        initialAddArgumentButton.className = "hide"; // TEST TO SEE WORKS ON ZERO
    }
});


const form = document.querySelector("form");

// Critical aciton scheme parameters 
const casCircumstance = document.querySelector("#casCircumstance");
const casAction = document.querySelector("#casAction");
const casGoal = document.querySelector("#casGoal");
const casValue = document.querySelector("#casAction");
const casParent = null;

form.addEventListener("submit", e => {
    e.preventDefault();

    var argumentFromUser = casCircumstance.value + " -> " + casAction.value + " -> " + casGoal.value + " -> " + casValue.value;
    console.log("Initial argument = " + argumentFromUser);
    console.log("Number of arguments = " + numberOfArguments);

    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        argumentDescription: argumentFromUser,
        value: casCircumstance.value,
        action: casAction.value,
        goal: casGoal.value,
        value: casValue.value
    });

    var instance = M.Modal.getInstance(modal);
    instance.close();

    form.reset();
});

// SETTING UP COUNTER-ARGUMENT

// Initial argument button and text

// Need to perform empty tests / null tests !!!!

const counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");

const criticalQuestionsForSelection = document.getElementById("selectCriticalQuestion");

const counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");

counterArgumentTargetButton.addEventListener("click", function () {

    console.log("Counter argument target name = " + counterArgumentTargetName.value);

    var counterArgumentTargetNameValue = counterArgumentTargetName.value;

    var arguments = db.collection("arguments");

    var query = arguments.where("name", "==", "argument0").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });


    var query2 = arguments.where("name", "==", "argument0").get()
        .then(querySnapshot => {
            query2 = querySnapshot.docs.map(doc => doc.data())
            console.log(query2);
            query2.forEach(function (d) {
                console.log(d.name); // KEY accessing data name 
            });
        });
        


    var opt1 = document.createElement("option");
    opt1.value = "1";
    opt1.text = "Humphrey"
    criticalQuestionsForSelection.add(opt1);

});