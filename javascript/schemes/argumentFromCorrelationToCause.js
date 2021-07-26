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

var createArgumentFromCorrelationToCauseForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {

    lib.createArgumentForm(elementToAppend, "There is a correlation between A...", "accVariableA");
    lib.createArgumentForm(elementToAppend, "and B...", "accVariableB");
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

    var variableA = document.querySelector("#accVariableA");
    var variableB = document.querySelector("#accVariableB");
    var conclusion = document.querySelector("#accConclusion");

    var variables = []; 
    variables.push(variableA.value, variableB.value, conclusion.value); 
    test.fullVariableTesting(variables); 

    var argumentFromUser = "Correlation Premise: There is a positive correlation between " + variableA.value.toLowerCase() + " and " + variableB.value.toLowerCase()
    + "<br></br> Conclusion: " + conclusion.value.toLowerCase();
    console.log("Argument = ", argumentFromUser);

    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Argument from Correlation to Cause",
        argumentDescription: argumentFromUser,
        variableA: variableA.value.toLowerCase(),
        variableB: variableB.value.toLowerCase(), 
        conclusion: conclusion.value.toLowerCase()
    });

    /*----- Reset modal fields after argument submission ----*/
    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectArgumentScheme.selectedIndex = "reset";
    argumentForm.className = "hide";

    form.reset();

    variableA.remove();
    variableB.remove(); 
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
    var variableA;
    var variableB; 
    var conclusion;

    data.forEach(function (d) {
        variableA = d.variableA;
        variableB = d.variableB; 
        conclusion = d.conclusion;
    });

    createAndAppendAccCriticalQuestions(variableA, variableB, conclusion); 
});

var createAndAppendAccCriticalQuestions = (function (variableA, variableB, conclusion) {
    for (let i = 1; i < 4; i++) {
        var tempCriticalQuestion = accQuestionsSwitch(i, variableA, variableB, conclusion); 
        lib.addAndAppendOption(tempCriticalQuestion, i);  
    }
});

var accQuestionsSwitch = (function (questionNumber, variableA, variableB, conclusion) {
    switch (questionNumber) {
        case 1: 
            return "Is there really a correation between \"" + variableA + "\" and \"" + variableB + "\"?";
            break; 
        case 2:
            return "Is there any reason for thinking the correlation is anything more than coincidence?"; 
            break;
        case 3: 
            return "Could there be some third factor, C, that is causing both \"" + variableA + "\" and \"" + variableB + "\"?"; 
            break; 
        default: 
            "Select a scheme to generate critical questions"; 
    }
});

export {
    createArgumentFromCorrelationToCauseForm, 
    setupAccCriticalQuestions
};