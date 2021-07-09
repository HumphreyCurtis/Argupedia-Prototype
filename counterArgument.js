// Initialise modal
const modal1 = document.getElementById("modal1");

// Using materialise library to initialise modal 
M.Modal.init(modal1);

const selectTypeOfArgument = document.getElementById("selectArgument");

const counterArgumentSelectElement = document.getElementById("selectArgumentScheme2");

const counterArgumentScheme = document.getElementById("counterArgumentScheme");

const counterArgumentInputFields = document.getElementById("counterArgumentInputFields");

var currentArgument = "";

var argumentStatus = null;

// Number of arguments in debate
var numberOfArguments = 0;

// Update status of number of arguments to create ID
db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

});

selectTypeOfArgument.addEventListener('change', (event) => {

    console.log("Value selected is = ", selectTypeOfArgument.value);

    if (selectTypeOfArgument.value == "initialArgument") {

        counterArgumentScheme.className = "show";
        argumentStatus = "initialArgument";
        // counterArgumentSelectElementEventListener next function 

    } else if (selectTypeOfArgument.value == "counterArgument") {

        argumentStatus = "counterArgument";
        // counterArgumentSelectElementEventListener next function 

        // Piping in fields for counter argument using DIV 
        createInputFieldsForCounterArgument(counterArgumentInputFields, "Counter argument target name", "counterArgumentTargetName");
        appendSeeCriticalQuestionsButton(counterArgumentInputFields, "btn waves-effect white-text", "counterArgumentTargetButton");
        appendSelectCriticalQuestions(counterArgumentInputFields);
        counterArgumentScheme.className = "show";

        var counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");
        var counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");

        counterArgumentEventListener(); 

    }

});

// Listen to select element to determine which form to be produced 
// Will need to rename variables --> need to get working for counter arguments 
counterArgumentSelectElement.addEventListener('change', (event) => {
    console.log("Value selected is = " + counterArgumentSelectElement.value)

    if (counterArgumentSelectElement.value == "casForm") {
        counterArgumentScheme.className = "show";
        createCasForm(counterArgumentScheme, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1);
    }


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

        if (argumentStatus == "counterArgument") {
            counterArgumentSubmissionToDatabase();
        }

    });

});

var createArgumentForm = (function (elementToAppend, placeholder, id) {

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


var casSubmissionToDatabaseFromForm = (function (id, modalName) {

    const form = document.getElementById(id);
    const casCircumstance = document.querySelector("#casCircumstance");
    const casAction = document.querySelector("#casAction");
    const casNewCircumstance = document.querySelector("#casNewCircumstance");
    const casGoal = document.querySelector("#casGoal");
    const casValue = document.querySelector("#casValue"); 
    var argumentButton = document.getElementById("counterArgumentButton");

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

    // Trying to reset fields after argument submission
    var instance = M.Modal.getInstance(modalName);
    instance.close();

    // var selectArgument = document.getElementById("selectArgument"); 
    selectTypeOfArgument.selectedIndex = "reset";

    var selectArgumentScheme = document.getElementById("selectArgumentScheme2"); 
    selectArgumentScheme.selectedIndex = "reset";

    counterArgumentScheme.className = "hide";

    form.reset();
    casCircumstance.remove(); 
    casAction.remove(); 
    casNewCircumstance.remove(); 
    casGoal.remove(); 
    casValue.remove(); 
    argumentButton.remove(); 
});


/*------------------------------------------------------ COUNTER ARGUMENT FUNCTIONALITY BELOW ----------------------------------------------------------------------------*/

var createInputFieldsForCounterArgument = (function (elementToAppend, placeholder, id) {

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

var appendSeeCriticalQuestionsButton = (function (elementToAppend, colour, id) {
    var div = document.createElement("div");
    div.setAttribute("class", "input-field");

    var button = document.createElement("btn");
    button.setAttribute("class", colour);
    button.textContent = "See critical questions";
    button.setAttribute("id", id);

    div.append(button);

    var div2 = document.createElement("div");
    div.append(div2);


    elementToAppend.append(div);
});

var appendSelectCriticalQuestions = (function (elementToAppend) {

    var label = document.createElement("label");
    label.textContent = "Select a critical question";
    label.setAttribute("id", "selectCriticalQuestionLabel");

    var select = document.createElement("select");
    select.setAttribute("class", "browser-default");
    select.setAttribute("id", "selectCriticalQuestion")

    var option = document.createElement("option");
    option.textContent = "Choose your option";

    select.append(option);

    elementToAppend.append(label);
    elementToAppend.append(select);
});

/* Function to create critical questions for user */
var counterArgumentEventListener = (function () {

    // Will have to adapt to work for multiple different types of scheme 
    counterArgumentTargetButton.addEventListener("click", function () {

        var counterArgumentTargetNameValue = counterArgumentTargetName.value;

        console.log("Counter argument target name = " + counterArgumentTargetNameValue);

        var args = db.collection("arguments");

        // Generating critical questions - rename variables
        var query2 = args.where("name", "==", counterArgumentTargetNameValue).get()
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

});

var createAndAppendCriticalQuestions = (function (currentCircumstance, action, goal, value, newCircumstances) {
    for (let i = 1; i < 17; i++) {
        var tempCriticalQuestion = casCriticalQuestionsSwitch(i, currentCircumstance, action, goal, value, newCircumstances);
        addAndAppendOption(tempCriticalQuestion, i);
    }
});

var casCriticalQuestionsSwitch = (function (questionNumber, currentCircumstance, action, goal, value, newCircumstances) {

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
    var criticalQuestionsForSelection = document.getElementById("selectCriticalQuestion");
    var option = document.createElement("option");
    option.value = valueNumber;
    option.text = criticalQuestion;
    criticalQuestionsForSelection.add(option);
});


var counterArgumentSubmissionToDatabase = (function() {

    console.log("Counter argument target name = " + counterArgumentTargetName.value);
    currentArgumentName();
    console.log("Current counter-argument name = " + currentArgument);
    createLinksForCounterArgument(currentArgument, counterArgumentTargetName.value);

    // Resetting fields from counterargument
    var selectCriticalQuestion = document.getElementById("selectCriticalQuestion");
    var selectCriticalQuestionLabel = document.getElementById("selectCriticalQuestionLabel");

    counterArgumentTargetName.remove();
    selectCriticalQuestion.remove(); 
    selectCriticalQuestionLabel.remove(); 
    counterArgumentTargetButton.remove(); 

});

var currentArgumentName = db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    var numberOfArguments = querySnapshot.docs.length;

    currentArgument = "argument" + numberOfArguments;
});


var createLinksForCounterArgument = (function (source, target) {
    db.collection("links").add({
        source: source,
        target: target
    });
});




