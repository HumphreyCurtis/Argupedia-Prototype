/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------- Key global variables ----------------------------------------------------------------------- 
 */


/* Using materialise library to initialise modal */
const modal1 = document.getElementById("modal1");
M.Modal.init(modal1);

const selectTypeOfArgument = document.getElementById("selectArgument");

const selectArgumentScheme = document.getElementById("selectArgumentScheme2");

const argumentForm = document.getElementById("counterArgumentScheme");

const counterArgumentInputFields = document.getElementById("counterArgumentInputFields");

var currentArgument = "";

var argumentStatus = null;

var numberOfArguments = 0;


/* 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------- Functions needed for initial arguments ------------------------------------------------------------------- 
 */


/* Function which updates variable status of number of arguments to create unique ID */
db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

});

/* Event listener which deduces whether user wants to create a counter argument or initial argument */
selectTypeOfArgument.addEventListener('change', (event) => {

    console.log("Value selected is = ", selectTypeOfArgument.value);

    if (selectTypeOfArgument.value == "initialArgument") {

        argumentForm.className = "show";
        argumentStatus = "initialArgument";
        // counterArgumentSelectElementEventListener next function 

    } else if (selectTypeOfArgument.value == "counterArgument") {

        argumentStatus = "counterArgument";
        // counterArgumentSelectElementEventListener next function 

        /* Piping in fields for counter argument using div counterargumentInputFields */
        createInputFieldsForCounterArgument(counterArgumentInputFields, "Counter argument target name", "counterArgumentTargetName");
        appendSeeCriticalQuestionsButton(counterArgumentInputFields, "btn waves-effect white-text", "counterArgumentTargetButton");
        appendSelectCriticalQuestions(counterArgumentInputFields);
        argumentForm.className = "show";

        counterArgumentEventListener();
    }

});

/* Event listener which listens to type of argument scheme to be selected e.g. critical action scheme */
selectArgumentScheme.addEventListener('change', (event) => {
    console.log("Value selected is = " + selectArgumentScheme.value)

    if (selectArgumentScheme.value == "casForm") {
        argumentForm.className = "show";
        createCasForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1);
    }


});

/* Function to create Cas form for database */
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

/* Function which submits CAS form to database */
var casSubmissionToDatabaseFromForm = (function (id, modalName) {

    var form = document.getElementById(id);
    var casCircumstance = document.querySelector("#casCircumstance");
    var casAction = document.querySelector("#casAction");
    var casNewCircumstance = document.querySelector("#casNewCircumstance");
    var casGoal = document.querySelector("#casGoal");
    var casValue = document.querySelector("#casValue");

    userArgumentVariableTests(casCircumstance.value, casAction.value, casNewCircumstance.value, casGoal.value, casValue.value);

    var argumentFromUser = casCircumstance.value.toLowerCase() + " -> " + casAction.value.toLowerCase() + " -> " + casNewCircumstance.value.toLowerCase() + " -> " + casGoal.value.toLowerCase() + " -> " + casValue.value.toLowerCase();
    console.log("Argument = " + argumentFromUser);

    /* Submit fields to database */
    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        argumentDescription: argumentFromUser,
        currentCircumstance: casCircumstance.value.toLowerCase(),
        action: casAction.value.toLowerCase(),
        newCircumstance: casNewCircumstance.value.toLowerCase(),
        goal: casGoal.value.toLowerCase(),
        value: casValue.value.toLowerCase()
    });

    /*----- Reset modal fields after argument submission ----*/
    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectArgumentScheme.selectedIndex = "reset";
    argumentForm.className = "hide";

    form.reset();
    casCircumstance.remove();
    casAction.remove();
    casNewCircumstance.remove();
    casGoal.remove();
    casValue.remove();

    var argumentButton = document.getElementById("counterArgumentButton");
    argumentButton.remove();
});


/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------- Counter-argument functionality ----------------------------------------------------------------------------
 */


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

    var counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");
    var counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");

    // Will have to adapt to work for multiple different types of scheme 
    counterArgumentTargetButton.addEventListener("click", function () {

        var counterArgumentTargetNameValue = counterArgumentTargetName.value;
        var args = db.collection("arguments");

        console.log("Counter argument target name = " + counterArgumentTargetNameValue);

        // Generating critical questions - rename variables
        var query2 = args.where("name", "==", counterArgumentTargetNameValue).get()
            .then(querySnapshot => {
                query2 = querySnapshot.docs.map(doc => doc.data())
                console.log(query2);
                console.log("Empty array test on query = ", emptyArrayTest(query2));
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

var counterArgumentSubmissionToDatabase = (function () {

    var counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");
    var counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");

    /* Creating links to add to collection within database */
    console.log("Counter argument target name = " + counterArgumentTargetName.value);
    currentArgumentName();
    console.log("Current counter-argument name = " + currentArgument);
    createLinksForCounterArgument(currentArgument, counterArgumentTargetName.value);

    /* Resetting fields from counterargument modal */
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

/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------Tests to perform on variables before database submission----------------------------------------------------------------
 */


var userArgumentVariableTests = (function (circumstance, action, newCircumstance, goal, value) {
    var variables = [];

    variables.push(circumstance, action, newCircumstance, goal, value);

    console.log("Test variables array = ", variables);

    for (let i = 0; i < variables.length; i++) {
        var currentVariable = variables[i];
        if (emptyTest(currentVariable) || nullTest(currentVariable)) {
            alert("Invalid argument variables input by user");
        } 
    }
});

var emptyTest = (function (input) {
    if (nullTest(input) == false) {
        if (input.length > 0) {
            return false;
        }
        return true;
    }
    return true;
});

var nullTest = (function (input) {
    if (input == null) {
        return true;
    }
    return false;
});

var emptyArrayTest = (function(input) {
    if (input.length > 0) {
        return false; 
    }
    return true; 
})

/*------------------------------------------------------------------------------------Unit tests---------------------------------------------------------------------------------- */
//  let x = null; 
//  let y = "";
//  let z = "hello";

//  console.log(nullTest(x));
//  console.log(emptyTest(x));
//  console.log(emptyTest(y));
//  console.log(emptyTest(z));
//  console.log(nullTest(z)); 

// let circumstanceTest = "circumstance"; 
// let actionTest = "action"; 
// let newCircumstanceTest = "newCircumstance"; 
// let goalTest = "goalTest"; 

// userArgumentVariableTests(circumstanceTest, actionTest, newCircumstanceTest, goalTest); 

// let arrayTest = []; 
// console.log(emptyArrayTest(arrayTest)); 


/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */