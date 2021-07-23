import * as lib from "../library.js";
import * as test from "../test.js";

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------- Argumentation functionality ----------------------------------------------------------------------------
 */

var numberOfArguments = 0;

const selectTypeOfArgument = document.getElementById("selectArgument");
const selectArgumentScheme = document.getElementById("selectArgumentScheme2");
const argumentForm = document.getElementById("counterArgumentScheme");


/* Function which updates variable status of number of arguments to create unique ID */
db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

});

/* Function to create Cas form for database */
var createCasForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {

    lib.createArgumentForm(elementToAppend, "In the current circumstance...", "casCircumstance");
    lib.createArgumentForm(elementToAppend, "We should perform the action...", "casAction");
    lib.createArgumentForm(elementToAppend, "Which would result in new circumstances...", "casNewCircumstance");
    lib.createArgumentForm(elementToAppend, "Which will realise goal...", "casGoal");
    lib.createArgumentForm(elementToAppend, "Which will promote value...", "casValue");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        casSubmissionToDatabaseFromForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments);
        }
    });

});

/* Function which submits CAS form to database */
var casSubmissionToDatabaseFromForm = (function (id, modalName) {

    var form = document.getElementById(id);
    var casCircumstance = document.querySelector("#casCircumstance");
    var casAction = document.querySelector("#casAction");
    var casNewCircumstance = document.querySelector("#casNewCircumstance");
    var casGoal = document.querySelector("#casGoal");
    var casValue = document.querySelector("#casValue");

    var variables = [];
    variables.push(casCircumstance.value, casAction.value, casNewCircumstance.value, casGoal.value, casValue.value);
    test.fullVariableTesting(variables);

    var argumentFromUser = "In the current circumstance: " + casCircumstance.value.toLowerCase() + "<br></br>We should perform action: " + casAction.value.toLowerCase() + "<br></br>Which will result in new circumstance: " 
    + casNewCircumstance.value.toLowerCase() + "<br></br>Which will realise the goal: " + casGoal.value.toLowerCase() + "<br></br>Which will promote the value: " + casValue.value.toLowerCase() + "<br></br>";
    console.log("Argument = " + argumentFromUser);

    /* Submit fields to database */
    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Critical Action Scheme",
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
 * -------------------------------------------------------------------- Critical question functionality ---------------------------------------------------------------------------
 */

var setupCasCriticalQuestions = (function (data) {
    var currentCircumstance;
    var action;
    var newCircumstance;
    var goal;
    var value;

    data.forEach(function (d) {
        currentCircumstance = d.currentCircumstance;
        action = d.action;
        newCircumstance = d.newCircumstance;
        goal = d.goal;
        value = d.value;
    });

    createAndAppendCriticalQuestions(currentCircumstance, action, goal, value, newCircumstance);
});


var createAndAppendCriticalQuestions = (function (currentCircumstance, action, goal, value, newCircumstances) {
    for (let i = 1; i < 17; i++) {
        var tempCriticalQuestion = casCriticalQuestionsSwitch(i, currentCircumstance, action, goal, value, newCircumstances);
        lib.addAndAppendOption(tempCriticalQuestion, i);
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


export {
    createCasForm,
    setupCasCriticalQuestions
};