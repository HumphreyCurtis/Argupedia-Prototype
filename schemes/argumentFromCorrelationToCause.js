import * as lib from "../library.js";

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

var createArgumentFromCorrelationToCauseForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {
    lib.createArgumentForm(elementToAppend, "There is a correlation between A and B", "accCorrelationPremise");
    lib.createArgumentForm(elementToAppend, "Therefore A causes B", "accConclusion");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        accSubmissionToDatabaseForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments);
        }
    });

});

var accSubmissionToDatabaseForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var correlationPremise = document.querySelector("#accCorrelationPremise");
    var conclusion = document.querySelector("#accConclusion");

    var argumentFromUser = correlationPremise.value + " -> " + conclusion.value;
    console.log("Argument = ", argumentFromUser);

    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Argument from Correlation to Cause",
        argumentDescription: argumentFromUser,
        correlationPremise: correlationPremise.value,
        conclusion: conclusion.value
    });

    /*----- Reset modal fields after argument submission ----*/
    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectArgumentScheme.selectedIndex = "reset";
    argumentForm.className = "hide";

    form.reset();

    correlationPremise.remove();
    conclusion.remove();

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

var setupAccCriticalQuestions = (function (data) {
    var correlationPremise;
    var conclusion;

    data.forEach(function (d) {
        correlationPremise = d.correlationPremise;
        conclusion = d.conclusion;
    });

    createAndAppendAccCriticalQuestions(correlationPremise, conclusion); 
});

var createAndAppendAccCriticalQuestions = (function (correlationPremise, conclusion) {
    for (let i = 1; i < 4; i++) {
        var tempCriticalQuestion = accQuestionsSwitch(i, correlationPremise, conclusion); 
        lib.addAndAppendOption(tempCriticalQuestion, i);  
    }
});

var accQuestionsSwitch = (function (questionNumber, correlationPremise, conclusion) {
    switch (questionNumber) {
        case 1: 
            return "Is there really a correation between " + correlationPremise + "?";
            break; 
        case 2:
            return "Is there any reason for thinking the correlation is anything more than coincidence?"; 
            break;
        case 3: 
            return "Could there be some third factor, C, that is causing both " + conclusion + "?"; 
            break; 
        default: 
            "Select a scheme to generate critical questions"; 
    }
});

export {
    createArgumentFromCorrelationToCauseForm, 
    setupAccCriticalQuestions
};