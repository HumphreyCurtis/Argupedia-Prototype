import * as lib from "./library.js";

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

var createAppealToPopularOpinionForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {
    lib.createArgumentForm(elementToAppend, "A is generally accepted as being true", "apoGeneralAcceptancePremise");
    lib.createArgumentForm(elementToAppend, "If A is generaly accepted as being true that gives a reasaon in favour of A", "apoPresumptionPremise");
    lib.createArgumentForm(elementToAppend, "There is a reason in favour of A", "apoOpinion");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        apoSubmissionToDatabaseFromForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments);
        }
    });
});

var apoSubmissionToDatabaseFromForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var premise = document.querySelector("#apoGeneralAcceptancePremise");
    var presumptionPremise = document.querySelector("#apoPresumptionPremise");
    var opinion = document.querySelector("#apoOpinion");

    var argumentFromUser = "Not much more than -> " + premise.value;

    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Appeal to Popular Opinion",
        argumentDescription: argumentFromUser,
        userPremise: premise.value
    });

    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectArgumentScheme.selectedIndex = "reset";
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

var setupApoCriticalQuestions = (function (data) {
    console.log("apo data = ", data); 
    var premise;

    data.forEach(function (d) {
        premise = d.userPremise;
    });
    console.log("premise = ", premise); 

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
            return "What evidence do we have for believing that " + premise + " is generally accepted?";
            break;
        case 2:
            return "Even if " + premise + " is generally accepted as being true, are there good reasons for doubting its veracity?";
            break;
        default:
            "Select a scheme to genearte critical questions";
    }
});

export {
    createAppealToPopularOpinionForm,
    setupApoCriticalQuestions
};