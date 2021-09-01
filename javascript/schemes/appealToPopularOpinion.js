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

/* 
 * Function which updates variable status of number of arguments to create unique ID 
 *
 */
db.collection("arguments").onSnapshot(function (querySnapshot) {

    // console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

});

/*
 * Function which creates appeal to popular opinion form and has event listener for submission of form 
 * Also recognises if user is submitting counter-attacking argument
 * 
 */
var createAppealToPopularOpinionForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {
    lib.createArgumentForm(elementToAppend, "A is generally accepted as being true...", "apoGeneralAcceptancePremise");
    lib.createArgumentForm(elementToAppend, "If A is generaly accepted as being true that gives a reason in favour of A...", "apoPresumptionPremise");
    lib.createArgumentForm(elementToAppend, "There is a reason in favour of A...", "apoOpinion");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        apoSubmissionToDatabaseFromForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments);
        }
    });
});

/*
 * Function which performs submission to database of user inputted data 
 *
 */
var apoSubmissionToDatabaseFromForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var premise = document.querySelector("#apoGeneralAcceptancePremise");
    var presumptionPremise = document.querySelector("#apoPresumptionPremise");
    var opinion = document.querySelector("#apoOpinion");

    var variables = [];
    variables.push(premise.value, presumptionPremise.value, opinion.value);
    test.fullVariableTesting(variables);

    var argumentFromUser = "General acceptance premise: " + premise.value.toLowerCase() + 
    "<br></br>Presumption Premise: " + presumptionPremise.value.toLowerCase() + 
    "<br></br>Conclusion: " + opinion.value.toLowerCase();

    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Appeal to Popular Opinion",
        argumentDescription: argumentFromUser,
        userPremise: premise.value.toLowerCase()
    });

    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectTypeOfArgument.disabled = false; 
    selectArgumentScheme.selectedIndex = "reset";
    selectArgumentScheme.disabled = false; 
    argumentForm.className = "hide";

    form.reset();

    premise.remove();
    presumptionPremise.remove();
    opinion.remove();

    var argumentButton = document.getElementById("counterArgumentButton");
    argumentButton.remove();
});

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------- Critical question functionality ----------------------------------------------------------------------------
 */

/*
 * Function which dynamically builds critical questions 
 *
 */
var setupApoCriticalQuestions = (function (data) {
    var premise;

    data.forEach(function (d) {
        premise = d.userPremise;
    });
    // console.log("apo data = ", data); 
    // console.log("premise = ", premise); 

    createAndAppendApoCriticalQUestions(premise); 
});

var createAndAppendApoCriticalQUestions = (function (premise) {
    for (let i = 1; i < 3; i++) {
        var tempCriticalQuestion = apoCriticalQuestionSwitch(i, premise);
        lib.addAndAppendOption(tempCriticalQuestion, i);
    }

});

var apoCriticalQuestionSwitch = (function (questionNumber, premise) {
    switch (questionNumber) {
        case 1:
            return "What evidence do we have for believing that \"" + premise + "\" is generally accepted?";
            break;
        case 2:
            return "Even if \"" + premise + "\" is generally accepted as being true, are there good reasons for doubting its veracity?";
            break;
        default:
            "Select a scheme to genearte critical questions";
    }
});

export {
    createAppealToPopularOpinionForm,
    setupApoCriticalQuestions
};