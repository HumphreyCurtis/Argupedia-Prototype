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
// const actionSchemeForm = document.getElementById("criticalActionScheme");
const argumentSchemeForm = document.getElementById("initialArgumentScheme");

// Number of arguments in debate
var numberOfArguments = 0;

const initialAddArgumentButton = document.getElementById("initialAddButton");

const initialArgumentScheme = document.getElementById("initialArgumentScheme");

// Dynamically create argument scheme form 

selectElement.addEventListener('change', (event) => {
    console.log("Value selected is:");
    console.log(argumentSchemeSelected.value);

    if (argumentSchemeSelected.value === "1") { // Will need to change to make better 
        argumentSchemeForm.className = "show";
        createCasForm(initialArgumentScheme, "initialArgumentScheme");

    } else {
        argumentSchemeForm.className = "hide";
    }
});

// Check to hide initial argument button 
db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

    if (numberOfArguments > 0) {
        initialAddArgumentButton.className = "hide"; // TEST TO SEE WORKS ON ZERO
    }
});

var createCasForm = (function (elementToAppend, id) {

    createArgumentForm(elementToAppend, "In the current circumstance...", "casCircumstance");
    createArgumentForm(elementToAppend, "We should perform the action...", "casAction");
    createArgumentForm(elementToAppend, "Which would result in new circumstances...", "casNewCircumstance");
    createArgumentForm(elementToAppend, "Which will realise goal...", "casGoal");
    createArgumentForm(elementToAppend, "Which will promote value...", "casValue");

    appendArgumentButton(elementToAppend, "btn pink white-text", "initialArgumentButton");

    var initialArgumentButton = document.getElementById("initialArgumentButton"); 

    initialArgumentButton.addEventListener("click", function(){

       casSubmissionToDatabaseFromForm(id); 

    });

});

// Sort form submission 

var casSubmissionToDatabaseFromForm = (function (id) {

    const form = document.getElementById(id);

    const casCircumstance = document.querySelector("#casCircumstance");
    const casAction = document.querySelector("#casAction");
    const casNewCircumstance = document.querySelector("#casNewCircumstance");
    const casGoal = document.querySelector("#casGoal");
    const casValue = document.querySelector("#casValue");

    var argumentFromUser = casCircumstance.value.toLowerCase() + " -> " + casAction.value.toLowerCase() + " -> " + casNewCircumstance.value.toLowerCase() + " -> " + casGoal.value.toLowerCase() + " -> " + casValue.value.toLowerCase();
    console.log("Initial argument = " + argumentFromUser);

    var instance = M.Modal.getInstance(modal);
    instance.close();

    form.reset();
});





const form = document.getElementById("initialArgumentScheme");

// Critical aciton scheme parameters --> potentially make var if will reuse 
const casCircumstance = document.querySelector("#casCircumstance");
const casAction = document.querySelector("#casAction");
const casNewCircumstance = document.querySelector("#casNewCircumstance");
const casGoal = document.querySelector("#casGoal");
const casValue = document.querySelector("#casValue");
const casParent = null;

form.addEventListener("submit", e => {
    e.preventDefault();

    var argumentFromUser = casCircumstance.value.toLowerCase() + " -> " + casAction.value.toLowerCase() + " -> " + casNewCircumstance.value.toLowerCase() + " -> " + casGoal.value.toLowerCase() + " -> " + casValue.value.toLowerCase();
    console.log("Initial argument = " + argumentFromUser);
    console.log("Number of arguments = " + numberOfArguments);

    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        argumentDescription: argumentFromUser,
        currentCircumstance: casCircumstance.value.toLowerCase(),
        action: casAction.value.toLowerCase(),
        newCircumstance: casNewCircumstance.value.toLowerCase(),
        goal: casGoal.value.toLowerCase(),
        value: casValue.value.toLowerCase()
    });

    var instance = M.Modal.getInstance(modal);
    instance.close();

    form.reset();
});




// --------------------------------------- SETTING UP COUNTER-ARGUMENT ------------------------------------------------------------

// Need to perform empty tests / null tests !!!!

const counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");

const criticalQuestionsForSelection = document.getElementById("selectCriticalQuestion");

const counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");

counterArgumentTargetButton.addEventListener("click", function () {

    var counterArgumentTargetNameValue = counterArgumentTargetName.value;

    console.log("Counter argument target name = " + counterArgumentTargetNameValue);


    var arguments = db.collection("arguments");

    // var query = arguments.where("name", "==", "argument0").get().then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             // doc.data() is never undefined for query doc snapshots
    //             console.log(doc.id, " => ", doc.data());
    //         });
    //     })
    //     .catch((error) => {
    //         console.log("Error getting documents: ", error);
    //     });


    var query2 = arguments.where("name", "==", counterArgumentTargetNameValue).get()
        .then(querySnapshot => {
            query2 = querySnapshot.docs.map(doc => doc.data())
            console.log(query2);
            query2.forEach(function (d) {

                var currentCircumstance = d.currentCircumstance;
                var action = d.action;
                var newCircumstance = d.newCircumstance;
                var goal = d.goal;
                var value = d.value;

                createAndAppendCriticalQuestions(currentCircumstance, action, goal, value, newCircumstance);
            });

        });

});

var createAndAppendCriticalQuestions = (function (currentCircumstance, action, goal, value, newCircumstances) {
    for (let i = 1; i < 17; i++) {
        var tempCriticalQuestion = criticalQuestionsSwitch(i, currentCircumstance, action, goal, value, newCircumstances);
        addAndAppendOption(tempCriticalQuestion, i);
    }
});



var criticalQuestionsSwitch = (function (questionNumber, currentCircumstance, action, goal, value, newCircumstances) {

    // var q1 = "Are the believed " + currentCircumstance + " true?";
    // var q2 = "Assuming the " + currentCircumstance + ", does the " + action + " have the stated consequences";
    // var q3 = "Assuming the " + currentCircumstance + " and that the " + action + " has the stated consequences, will the " + action + " bring about the desired " + goal;
    // var q4 = "Does the " + goal + " realise the " + value + " stated?";
    // var q5 = "Are there alternative ways of realising the same " + goal + "?";
    // var q6 = "Are there alternative ways of realising the same " + consequences + "?";
    // var q7 = "Are there alternative ways of promoting the same " + value + "?";
    // var q8 = "Does doing the action have a side effect which demotes the " + value + "?";
    // var q9 = "Does the " + action + " have a side effect which demotes some other value?";
    // var q10 = "Does doing the " + action + " promote some other " + value;
    // var q11 = "Does doing the " + action + "preclude some other action which would promote some other value?";
    // var q12 = "Are the " + newCircumstances + " as desired possible";
    // var q13 = "Is the " + action + " possible?";
    // var q14 = "Are the " + newCircumstances + " as described possible?"
    // var q15 = "Can the desired " + goal + " be realised?";
    // var q16 = "Is the " + value + " indeed a legitimate value?"

    switch (questionNumber) {
        case 1:
            return "Are the believed " + currentCircumstance + " true?";
            break;
        case 2:
            return "Assuming the " + currentCircumstance + ", does the " + action + " have the stated consequences?";
            break;
        case 3:
            return "Assuming the " + currentCircumstance + " and that the " + action + " has the stated " + newCircumstances + ", will the " + action + " bring about the desired " + goal + "?";
            break;
        case 4:
            return "Does the " + goal + " realise the " + value + " stated?";
            break;
        case 5:
            return "Are there alternative ways of realising the same " + newCircumstances + "?";
            break;
        case 6:
            return "Are there alternative ways of realising the same " + goal + "?";
            break;
        case 7:
            return "Are there alternative ways of promoting the same " + value + "?";
            break;
        case 8:
            return "Does doing the " + action + " have a side effect which demotes the " + value + "?";
            break;
        case 9:
            return "Does the " + action + " have a side effect which demotes some other value?";
            break;
        case 10:
            return "Does doing the " + action + " promote some other value?";
            break;
        case 11:
            return "Does doing the " + action + " preclude some other action which would promote some other value?";
            break;
        case 12:
            return "Are the " + currentCircumstance + " as described possible?";
            break;
        case 13:
            return "Is the " + action + " possible?";
            break;
        case 14:
            return "Are the " + newCircumstances + " as described possible?"
            break;
        case 15:
            return "Can the desired " + goal + " be realised?";
            break;
        case 16:
            return "Is the " + value + " indeed a legitimate value?";
            break;
        default:
            "Select a scheme to generate critical questions";
    }

});

var addAndAppendOption = (function (criticalQuestion, valueNumber) {
    var option = document.createElement("option");
    option.value = valueNumber;
    option.text = criticalQuestion;
    criticalQuestionsForSelection.add(option);
});

const counterArgumentScheme = document.getElementById("counterArgumentScheme");

var createArgumentForm = (function (elementToAppend, placeholder, id) {
    // var casForm = document.createElement("form"); 
    // casForm.setAttribute("class", "show"); 
    // casForm.setAttribute("id", "counterArgumentScheme"); 

    var div = document.createElement("div");
    div.setAttribute("class", "input-field");

    var inputField = document.createElement("input");
    inputField.setAttribute("type", "text");
    inputField.setAttribute("placeholder", placeholder);
    inputField.setAttribute("id", id);

    div.append(inputField);

    var div2 = document.createElement("div");
    div.append(div2);

    elementToAppend.append(div);
});



// createArgumentForm(counterArgumentScheme, "In the current circumstance...", "casCircumstance");
// appendArgumentButton(counterArgumentScheme, "btn waves-effect white-text");  
// createArgumentForm("We should perform the action...", "casAction"); 
// createArgumentForm("Which would result in new circumstances...", "casNewCircumstance"); 
// createArgumentForm("Which will realise goal...", "casGoal"); 
// createArgumentForm("Which will promote value...", "casValue");




var appendArgumentButton = (function (elementToAppend, colour, id) {
    var div = document.createElement("div");
    div.setAttribute("class", "input-field");

    var button = document.createElement("btn");
    button.setAttribute("class", colour);
    button.textContent = "Create argument";
    button.setAttribute("id", id);

    div.append(button);

    var div2 = document.createElement("div");
    div.append(div2);


    elementToAppend.append(div);

});

// appendArgumentButton(counterArgumentScheme, "btn waves-effect white-text");