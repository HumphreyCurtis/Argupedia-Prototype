import * as lib from "../library.js";

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


/* Function which updates variable status of number of arguments to create unique ID */
db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

});


var createArgumentFromPositionToKnowForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {
    lib.createArgumentForm(elementToAppend, "X is in the position to know...", "afpPositionToKnow");
    lib.createArgumentForm(elementToAppend, "X asserts that A is true or false...", "afpAssertion");
    lib.createArgumentForm(elementToAppend, "A may be plausibly taken to be true or false...", "afpConclusion");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        afpSubmissionToDatabaseForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments);
        }
    });

});

var afpSubmissionToDatabaseForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var positionToKnow = document.querySelector("#afpPositionToKnow");
    var assertionPremise = document.querySelector("#afpAssertion");
    var conclusion = document.querySelector("#afpConclusion");

    var argumentFromUser = positionToKnow.value + " -> " + assertionPremise.value + " -> " + conclusion.value;
    console.log("Argument = " + argumentFromUser);
    console.log("Number of arguments = " + numberOfArguments); 

    /* Submit fields to database */
    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Argument from Position to Know",
        argumentDescription: argumentFromUser,
        positionToKnow: positionToKnow.value,
        assertionPremise: assertionPremise.value,
        conclusion: conclusion.value
    });

    /*----- Reset modal fields after argument submission ----*/
    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectArgumentScheme.selectedIndex = "reset";
    argumentForm.className = "hide";

    form.reset();

    positionToKnow.remove();
    assertionPremise.remove();
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

var setupAfpCriticalQuestions = (function (data) {
    var positionToKnow;
    var assertionPremise;
    var conclusion;

    data.forEach(function (d) {
        positionToKnow = d.positionToKnow;
        assertionPremise = d.assertionPremise;
        conclusion = d.conclusion;
    });

    createAndAppendAfpCriticalQuestions(positionToKnow, assertionPremise, conclusion); 
});

var createAndAppendAfpCriticalQuestions = (function (positionToKnow, assertionPremise, conclusion) {
    for (let i=1; i<4; i++){
        var tempCriticalQuestion = afpQuestionSwitch(i, positionToKnow, assertionPremise, conclusion); 
        lib.addAndAppendOption(tempCriticalQuestion); 
    }
});

var afpQuestionSwitch = (function(questionNumber, positionToKnow, assertionPremise, conclusion){
    switch (questionNumber) {
        case 1: 
            return "Is the " + positionToKnow + " really in a position to know the " + conclusion + "?";
            break;  
        case 2:
            return "Is the source of " + positionToKnow + " honest, trustworthy and reliable?";   
            break;
        case 3: 
            return "Did the " + positionToKnow + " really assert the " + assertionPremise; 
            break;
        default: 
            "Select a scheme to generate a critical question"; 
    }
});

export {
    createArgumentFromPositionToKnowForm, 
    setupAfpCriticalQuestions
};