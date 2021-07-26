// Initialise modal
const modal = document.querySelector(".modal");

// Using materialise library to initialise modal 
M.Modal.init(modal);

// Event listener on argument scheme selected 
const selectElement = document.querySelector(".browser-default");

// Argument scheme selector
const argumentSchemeSelected = document.getElementById("selectArgumentScheme");

// Selecting and revealing forms
const argumentSchemeForm = document.getElementById("initialArgumentScheme");

// Number of arguments in debate
var numberOfArguments = 0;

const initialAddArgumentButton = document.getElementById("initialAddButton");

const initialArgumentScheme = document.getElementById("initialArgumentScheme");

// Dynamically create argument scheme form 
// selectElement.addEventListener('change', (event) => {
//     console.log("Value selected is:");
//     console.log(argumentSchemeSelected.value);

//     if (argumentSchemeSelected.value === "1") { // Will need to change to make better 
//         argumentSchemeForm.className = "show";


//     } else {
//         argumentSchemeForm.className = "hide";
//     }
// });

// Check to hide initial argument button 
db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

    // if (numberOfArguments > 0) {
    //     initialAddArgumentButton.className = "hide"; // TEST TO SEE WORKS ON ZERO
    // }
});

var createCasForm = (function (elementToAppend, id, buttonClass, buttonId, modalName) {

    createArgumentForm(elementToAppend, "In the current circumstance...", "casCircumstance");
    createArgumentForm(elementToAppend, "We should perform the action...", "casAction");
    createArgumentForm(elementToAppend, "Which would result in new circumstances...", "casNewCircumstance");
    createArgumentForm(elementToAppend, "Which will realise goal...", "casGoal");
    createArgumentForm(elementToAppend, "Which will promote value...", "casValue");

    appendArgumentButton(elementToAppend, buttonClass, buttonId);

    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        casSubmissionToDatabaseFromForm(id, modalName);
    });

});

// Sort form submission to database
var casSubmissionToDatabaseFromForm = (function (id, modalName) {

    const form = document.getElementById(id);
    const casCircumstance = document.querySelector("#casCircumstance");
    const casAction = document.querySelector("#casAction");
    const casNewCircumstance = document.querySelector("#casNewCircumstance");
    const casGoal = document.querySelector("#casGoal");
    const casValue = document.querySelector("#casValue"); 

    var argumentFromUser = casCircumstance.value.toLowerCase() + " -> " + casAction.value.toLowerCase() + " -> " + casNewCircumstance.value.toLowerCase() + " -> " + casGoal.value.toLowerCase() + " -> " + casValue.value.toLowerCase();
    console.log("Argument = " + argumentFromUser);

    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        argumentDescription: argumentFromUser,
        currentCircumstance: casCircumstance.value.toLowerCase(),
        action: casAction.value.toLowerCase(),
        newCircumstance: casNewCircumstance.value.toLowerCase(),
        goal: casGoal.value.toLowerCase(),
        value: casValue.value.toLowerCase()
    });


    var instance = M.Modal.getInstance(modalName);
    instance.close();

    form.reset();

    // Bug due to having the same id names on modals when accessing values 
    // if (numberOfArguments === 0) {
    //     console.log("hello from argument 0");
    //     argumentSchemeForm.className = "hide";
    //     initialArgumentScheme.remove(); 
    // }
});

// var createArgumentForm = (function (elementToAppend, placeholder, id) {

//     var div = document.createElement("div");
//     div.setAttribute("class", "input-field");

//     var inputField = document.createElement("input");
//     inputField.setAttribute("type", "text");
//     inputField.setAttribute("placeholder", placeholder);
//     inputField.setAttribute("id", id);

//     div.append(inputField);

//     var div2 = document.createElement("div");
//     div.append(div2);

//     elementToAppend.append(div);
// });


// var appendArgumentButton = (function (elementToAppend, colour, id) {
//     var div = document.createElement("div");
//     div.setAttribute("class", "input-field");

//     var button = document.createElement("btn");
//     button.setAttribute("class", colour);
//     button.textContent = "Create argument";
//     button.setAttribute("id", id);

//     div.append(button);

//     var div2 = document.createElement("div");
//     div.append(div2);


//     elementToAppend.append(div);

// });

// export { createCasForm, casSubmissionToDatabaseFromForm, createArgumentForm, appendArgumentButton }; 



























// --------------------------------------- SETTING UP COUNTER-ARGUMENT ------------------------------------------------------------

// Need to perform empty tests / null tests !!!!

// const counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");

// const criticalQuestionsForSelection = document.getElementById("selectCriticalQuestion");

// const counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");

// counterArgumentTargetButton.addEventListener("click", function () {

//     var counterArgumentTargetNameValue = counterArgumentTargetName.value;

//     console.log("Counter argument target name = " + counterArgumentTargetNameValue);


//     var arguments = db.collection("arguments");

//     // var query = arguments.where("name", "==", "argument0").get().then((querySnapshot) => {
//     //         querySnapshot.forEach((doc) => {
//     //             // doc.data() is never undefined for query doc snapshots
//     //             console.log(doc.id, " => ", doc.data());
//     //         });
//     //     })
//     //     .catch((error) => {
//     //         console.log("Error getting documents: ", error);
//     //     });

//     // Generating critical questions 
//     var query2 = arguments.where("name", "==", counterArgumentTargetNameValue).get()
//         .then(querySnapshot => {
//             query2 = querySnapshot.docs.map(doc => doc.data())
//             console.log(query2);
//             query2.forEach(function (d) {

//                 var currentCircumstance = d.currentCircumstance;
//                 var action = d.action;
//                 var newCircumstance = d.newCircumstance;
//                 var goal = d.goal;
//                 var value = d.value;

//                 createAndAppendCriticalQuestions(currentCircumstance, action, goal, value, newCircumstance);
//             });

//         });

// });

// var createAndAppendCriticalQuestions = (function (currentCircumstance, action, goal, value, newCircumstances) {
//     for (let i = 1; i < 17; i++) {
//         var tempCriticalQuestion = casCriticalQuestionsSwitch(i, currentCircumstance, action, goal, value, newCircumstances);
//         addAndAppendOption(tempCriticalQuestion, i);
//     }
// });



// var casCriticalQuestionsSwitch = (function (questionNumber, currentCircumstance, action, goal, value, newCircumstances) {

//     switch (questionNumber) {
//         case 1:
//             return "Are the believed " + currentCircumstance + " true?";
//             break;
//         case 2:
//             return "Assuming the " + currentCircumstance + ", does the " + action + " have the stated consequences?";
//             break;
//         case 3:
//             return "Assuming the " + currentCircumstance + " and that the " + action + " has the stated " + newCircumstances + ", will the " + action + " bring about the desired " + goal + "?";
//             break;
//         case 4:
//             return "Does the " + goal + " realise the " + value + " stated?";
//             break;
//         case 5:
//             return "Are there alternative ways of realising the same " + newCircumstances + "?";
//             break;
//         case 6:
//             return "Are there alternative ways of realising the same " + goal + "?";
//             break;
//         case 7:
//             return "Are there alternative ways of promoting the same " + value + "?";
//             break;
//         case 8:
//             return "Does doing the " + action + " have a side effect which demotes the " + value + "?";
//             break;
//         case 9:
//             return "Does the " + action + " have a side effect which demotes some other value?";
//             break;
//         case 10:
//             return "Does doing the " + action + " promote some other value?";
//             break;
//         case 11:
//             return "Does doing the " + action + " preclude some other action which would promote some other value?";
//             break;
//         case 12:
//             return "Are the " + currentCircumstance + " as described possible?";
//             break;
//         case 13:
//             return "Is the " + action + " possible?";
//             break;
//         case 14:
//             return "Are the " + newCircumstances + " as described possible?"
//             break;
//         case 15:
//             return "Can the desired " + goal + " be realised?";
//             break;
//         case 16:
//             return "Is the " + value + " indeed a legitimate value?";
//             break;
//         default:
//             "Select a scheme to generate critical questions";
//     }

// });

// var addAndAppendOption = (function (criticalQuestion, valueNumber) {
//     var option = document.createElement("option");
//     option.value = valueNumber;
//     option.text = criticalQuestion;
//     criticalQuestionsForSelection.add(option);
// });

// const counterArgumentScheme = document.getElementById("counterArgumentScheme");

// createArgumentForm(counterArgumentScheme, "In the current circumstance...", "casCircumstance");
// appendArgumentButton(counterArgumentScheme, "btn waves-effect white-text");  
// createArgumentForm("We should perform the action...", "casAction"); 
// createArgumentForm("Which would result in new circumstances...", "casNewCircumstance"); 
// createArgumentForm("Which will realise goal...", "casGoal"); 
// createArgumentForm("Which will promote value...", "casValue");



// appendArgumentButton(counterArgumentScheme, "btn waves-effect white-text");