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
    numberOfArguments = querySnapshot.docs.length;
});

/*
 * Function which creates argument from analogy form and has event listener for submission of form 
 * Also recognises if user is submitting counter-attacking argument
 * 
 */
var createArgumentFromAnalogyForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {
    lib.createArgumentForm(elementToAppend, "Generally, case C1...", "afaCase1");
    lib.createArgumentForm(elementToAppend, "Is similar to case C2...", "afaCase2");
    lib.createArgumentForm(elementToAppend, "A is true (or false)...", "afaBasePremise");
    lib.createArgumentForm(elementToAppend, "in case C1...", "afaCase1_2"); 
    lib.createArgumentForm(elementToAppend, "A is probably true (or false) in case C2...", "afaConclusion");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        afaSubmissionToDatabaseForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments);
        }
    });

});

/*
 * Function which performs submission to database of user inputted data 
 *
 */
var afaSubmissionToDatabaseForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var case1 = document.querySelector("#afaCase1");
    var case2 = document.querySelector("#afaCase2"); 
    var case2_2 = document.querySelector("#afaCase1_2");
    var basePremise = document.querySelector("#afaBasePremise");
    var conclusion = document.querySelector("#afaConclusion");

    var variables = []; 

    variables.push(case1.value, case2.value, case2_2.value, basePremise.value, conclusion.value);
    test.fullVariableTesting(variables); 

    var argumentFromUser = "Similarity premise: generally, " + case1.value.toLowerCase() + " is similar to " + case2.value.toLowerCase() + 
    "<br></br>Base Premise: " + basePremise.value.toLowerCase() + " in the circumstance of " + case1.value.toLowerCase() + 
    "<br></br>Conclusion: " + conclusion.value.toLowerCase();

    // console.log("Argument = ", argumentFromUser);

    /* Submit fields to database */
    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Argument from Analogy",
        argumentDescription: argumentFromUser,
        case1: case1.value.toLowerCase(),
        case2: case2.value.toLowerCase(), 
        basePremise: basePremise.value.toLowerCase(),
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

    case1.remove();
    case2.remove();
    case2_2.remove();
    basePremise.remove();
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

/*
 * Function which dynamically builds critical questions 
 *
 */
var setupAfaCriticalQuestions = (function (data) {
    var case1;
    var case2; 
    var basePremise;
    var conclusion;

    data.forEach(function (d) {
        case1 = d.case1,
        case2 = d.case2,
        basePremise = d.basePremise,
        conclusion = d.conclusion
    });

    createAndAppendAfaCriticalQuestions(case1, case2, basePremise, conclusion);
});

var createAndAppendAfaCriticalQuestions = (function (case1, case2, basePremise, conclusion) {
    for (let i = 1; i < 4; i++) {
        var tempCriticalQuestion = afaQuestionsSwitch(i, case1, case2, basePremise, conclusion); 
        lib.addAndAppendOption(tempCriticalQuestion, i); 
    }

});

/* 
 * C1 - case1
 * C2 - case2
 * A - basePremise
 */
var afaQuestionsSwitch = (function (questionNumber, case1, case2, basePremise, conclusion) {
    switch (questionNumber) {
        case 1:
            return "Is \"" + basePremise + "\" really true / false in \"" + case1 + "\"?";
            break;
        case 2:
            return "Are there differences between the \"" + case1 + "\" and \"" + case2 + "\" that would tend to undermine the force of the similarity cited?";
            break;
        case 3:
            return "Is there some case unstated that is also similar to \"" + case1 + "\" but in which the \"" + basePremise + "\" is true / false instead?"
            break;
        default:
            "Select a scheme to generate critical questions";
    }
});

export {
    createArgumentFromAnalogyForm, 
    setupAfaCriticalQuestions
};