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
var createArgumentFromPositionToKnowForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {
    lib.createArgumentForm(elementToAppend, "a is in the position to know...", "afpPositionToKnow");
    lib.createArgumentForm(elementToAppend, "a asserts that A is true or false...", "afpAssertion");
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

/*
 * Function which performs submission to database of user inputted data 
 *
 */
var afpSubmissionToDatabaseForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var positionToKnow = document.querySelector("#afpPositionToKnow");
    var assertionPremise = document.querySelector("#afpAssertion");
    var conclusion = document.querySelector("#afpConclusion");

    // var argumentFromUser = positionToKnow.value + " -> " + assertionPremise.value + " -> " + conclusion.value;
    
    var variables = []; 
    variables.push(positionToKnow.value, assertionPremise.value, conclusion.value);
    test.fullVariableTesting(variables); 

    var argumentFromUser = "Position to know premise: " + positionToKnow.value.toLowerCase() + 
    "<br></br>Assertion premise: " + assertionPremise.value.toLowerCase() + 
    "<br></br>Conclusion: " + conclusion.value.toLowerCase(); 

    // console.log("Argument = " + argumentFromUser);
    // console.log("Number of arguments = " + numberOfArguments); 

    /* Submit fields to database */
    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Argument from Position to Know",
        argumentDescription: argumentFromUser,
        positionToKnow: positionToKnow.value.toLowerCase(),
        assertionPremise: assertionPremise.value.toLowerCase(),
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

/*
 * Function which dynamically builds critical questions 
 *
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

/*
 * Variable information for function
 * positionToKnow = a 
 * conclusion = A 
 */
var afpQuestionSwitch = (function(questionNumber, positionToKnow, assertionPremise, conclusion){
    switch (questionNumber) {
        case 1: 
            return "Is the \"" + positionToKnow + "\" really in a position to know if the \"" + conclusion + "\" is true or false?";
            break;  
        case 2:
            return "Is \"" + positionToKnow + "\" an honest, trustworthy and reliable source?";   
            break;
        case 3: 
            return "Did the \"" + positionToKnow + "\" really assert the \"" + conclusion + "\"?"; 
            break;
        default: 
            "Select a scheme to generate a critical question"; 
    }
});

export {
    createArgumentFromPositionToKnowForm, 
    setupAfpCriticalQuestions
};