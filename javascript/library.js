
/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------- Library file for accesory functions  ------------------------------------------------------- 
 */


var createArgumentForm = (function (elementToAppend, placeholder, id) {

    var inputField = document.createElement("input");
    
    inputField.setAttribute("type", "text");
    inputField.setAttribute("placeholder", placeholder);
    inputField.setAttribute("id", id);

    elementToAppend.append(inputField);
});

var appendArgumentButton = (function (elementToAppend, colour, id) {

    var button = document.createElement("btn");

    button.setAttribute("class", colour);
    button.textContent = "Create argument";
    button.setAttribute("id", id);

    elementToAppend.append(button);
});

/* 
 * Function for creating links to add to collection within database 
 * Removing all necessary fields to clean up after submission
 *
 */
var counterArgumentSubmissionToDatabase = (function (numberOfArguments) {

    var counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");
    var counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");
    var buttonDiv = document.getElementById("buttonDiv"); 
    var currentArgument = "argument" + numberOfArguments;

    // console.log("Number of arguments at creation of links = ", numberOfArguments);

    var conflictingClaimsLabel = document.getElementById("conflictingClaimsLabel");
    var selectConflictingClaims = document.getElementById("selectConflictingClaims");

    /* Creating links to add to collection within database */
    // console.log("Counter argument target name = " + counterArgumentTargetName.value);
    // console.log("Current counter-argument name = " + currentArgument);
    createLinksForCounterArgument(currentArgument, counterArgumentTargetName.value);

    // console.log("Conflicting claims selected value = ", selectConflictingClaims.value); 

    if (selectConflictingClaims.value == "Yes") {
        // console.log("Drawing conflicting claims attack");
        createLinksForCounterArgument(counterArgumentTargetName.value, currentArgument);
    }

    /* Resetting fields from counterargument modal */
    var selectCriticalQuestion = document.getElementById("selectCriticalQuestion");
    var selectCriticalQuestionLabel = document.getElementById("selectCriticalQuestionLabel");

    // console.log("Critical question label = ", selectCriticalQuestion.value); 
    // selectCriticalQuestion.options.length = 0; --> can re-add if critical questions do not dissappear

    counterArgumentTargetName.remove();
    selectCriticalQuestion.remove();

    conflictingClaimsLabel.remove(); 
    selectConflictingClaims.remove();
    buttonDiv.remove(); 

    selectCriticalQuestionLabel.remove();
    counterArgumentTargetButton.remove();
});

var createLinksForCounterArgument = (function (source, target) {
    db.collection("links").add({
        source: source,
        target: target
    });
});

var addAndAppendOption = (function (criticalQuestion, valueNumber) {
    var criticalQuestionsForSelection = document.getElementById("selectCriticalQuestion");
    var option = document.createElement("option");

    option.value = criticalQuestion; 
    option.text = criticalQuestion;
    criticalQuestionsForSelection.add(option);
});

export {
    createArgumentForm,
    appendArgumentButton,
    counterArgumentSubmissionToDatabase,
    addAndAppendOption
};