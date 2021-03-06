import * as lib from "../library.js";
import * as test from "../test.js";

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------- Argumentation functionality -------------------------------------------------------------------------------
 */

var numberOfArguments = 0;

const selectTypeOfArgument = document.getElementById("selectArgument");
const selectArgumentScheme = document.getElementById("selectArgumentScheme2");
const argumentForm = document.getElementById("counterArgumentScheme");

/* 
 * Function which updates variable status of number of arguments to create unique ID 
 *
 */
db.collection("arguments").onSnapshot(function (querySnapshot) {
    numberOfArguments = querySnapshot.docs.length;
});

/*
 * Function which creates form and has event listener for submission of form 
 * Also recognises if user is submitting counter-attacking argument
 * 
 */
var createSlipperySlopeArgumentForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {
    lib.createArgumentForm(elementToAppend, "A is up for consideration as a proposal that seems like it should be brought about", "ssFirstStepPremise");
    lib.createArgumentForm(elementToAppend, "Bringing about A would lead to B which would lead to C and so forth", "ssRecursivePremise");
    lib.createArgumentForm(elementToAppend, "This would eventually lead to a horrible outcome", "ssBadOutcomePremise");
    lib.createArgumentForm(elementToAppend, "A should definitely not be brought about", "ssConclusion");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        ssSubmissionToDatabaseForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments);
        }
    });

});

/*
 * Function which performs submission to database of user inputted data 
 *
 */
var ssSubmissionToDatabaseForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var firstStepPremise = document.querySelector("#ssFirstStepPremise");
    var recursivePremise = document.querySelector("#ssRecursivePremise");
    var badOutcomePremise = document.querySelector("#ssBadOutcomePremise");
    var conclusion = document.querySelector("#ssConclusion");

    var variables = [];
    variables.push(firstStepPremise.value, recursivePremise.value, badOutcomePremise.value, conclusion.value);
    test.fullVariableTesting(variables);

    var argumentFromUser = "First step premise: " + firstStepPremise.value.toLowerCase() +
        "<br></br>Recursive premise: " + recursivePremise.value.toLowerCase() +
        "<br></br>Bad outcome premise: " + badOutcomePremise.value.toLowerCase() +
        "<br></br>Conclusion: " + conclusion.value.toLowerCase();

    // console.log("Argument = ", argumentFromUser);

    /* Submit fields to database */
    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Slippery Slope Argument",
        argumentDescription: argumentFromUser,
        firstStepPremise: firstStepPremise.value.toLowerCase(),
        recursivePremise: recursivePremise.value.toLowerCase(),
        badOutcomePremise: badOutcomePremise.value.toLowerCase(),
        conclusion: conclusion.value.toLowerCase()
    });

    /*----- Reset modal fields after argument submission ----*/
    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectTypeOfArgument.disabled = false; 
    selectArgumentScheme.selectedIndex = "reset";
    selectArgumentScheme.disabled = false; 
    argumentForm.className = "hide";


    form.reset();

    firstStepPremise.remove();
    recursivePremise.remove();
    badOutcomePremise.remove();
    conclusion.remove();

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

/*
 * Function which dynamically builds critical questions 
 *
 */
var setupSsCriticalQuestions = (function (data) {
    var firstStepPremise;
    var recursivePremise;
    var badOutcomePremise;
    var conclusion;

    data.forEach(function (d) {
        firstStepPremise = d.firstStepPremise,
            recursivePremise = d.recursivePremise,
            badOutcomePremise = d.badOutcomePremise,
            conclusion = d.conclusion
    });

    createAndAppendSsCriticalQuestions(firstStepPremise, recursivePremise, badOutcomePremise, conclusion);
});

var createAndAppendSsCriticalQuestions = (function (firstStepPremise, recursivePremise, badOutcomePremise, conclusion) {
    for (let i = 1; i < 4; i++) {
        var tempCriticalQuestion = ssQuestionsSwitch(i, firstStepPremise, recursivePremise, badOutcomePremise, conclusion);
        lib.addAndAppendOption(tempCriticalQuestion, i);
    }
});

var ssQuestionsSwitch = (function (questionNumber, firstStepPremise, recursivePremise, badOutcomePremise, conclusion) {
    switch (questionNumber) {
        case 1:
            return "What interveing propositions in the sequence linking \"" + recursivePremise + "\" are actually given?";
            break;
        case 2:
            return "What other steps are required to fill in the sequence to make it plausible?";
            break;
        case 3:
            return "What are the weakest links in the sequence, the places where key critical questions need to be asked?";
            break;
        default:
            "Select a scheme and generate critical questions";
    }
});

export {
    createSlipperySlopeArgumentForm,
    setupSsCriticalQuestions
}