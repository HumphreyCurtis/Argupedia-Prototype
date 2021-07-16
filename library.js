
/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------- Library file for accesory functions  ------------------------------------------------------- 
 */


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

/* 
 * Function for creating links to add to collection within database 
 * Removing all necessary fields to clean up after submission
 *
 */
var counterArgumentSubmissionToDatabase = (function (numberOfArguments) {

    var counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");
    var counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");
    var currentArgument = "argument" + numberOfArguments;

    console.log("Number of arguments at creation of links = ", numberOfArguments);

    /* Creating links to add to collection within database */
    console.log("Counter argument target name = " + counterArgumentTargetName.value);
    console.log("Current counter-argument name = " + currentArgument);
    createLinksForCounterArgument(currentArgument, counterArgumentTargetName.value);

    /* Resetting fields from counterargument modal */
    var selectCriticalQuestion = document.getElementById("selectCriticalQuestion");
    var selectCriticalQuestionLabel = document.getElementById("selectCriticalQuestionLabel");

    // selectCriticalQuestion.options.length = 0; --> can re-add if critical questions do not dissappear

    counterArgumentTargetName.remove();
    selectCriticalQuestion.remove();
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
    option.value = valueNumber;
    option.text = criticalQuestion;
    criticalQuestionsForSelection.add(option);
});

export {
    createArgumentForm,
    appendArgumentButton,
    counterArgumentSubmissionToDatabase,
    addAndAppendOption
};