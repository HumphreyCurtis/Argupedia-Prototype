import * as lib from "./library.js";

var numberOfArguments = 0;

const selectTypeOfArgument = document.getElementById("selectArgument");

const selectArgumentScheme = document.getElementById("selectArgumentScheme2");

const argumentForm = document.getElementById("counterArgumentScheme");


/* Function which updates variable status of number of arguments to create unique ID */
db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

});

var createExpertOpinionForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {
    lib.createArgumentForm(elementToAppend, "X is in the position to know...", "casOpinion");
    lib.createArgumentForm(elementToAppend, "Whether A is true or false...", "casTruth");
    lib.createArgumentForm(elementToAppend, "X asserts that A is true or false...", "casAssertion");
    lib.createArgumentForm(elementToAppend, "A may be plausibly taken to be true or false...", "casConclusion");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        console.log("Hello 2"); 
        eosSubmissionToDatabaseFromForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments); 
        }
    });
});

var eosSubmissionToDatabaseFromForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var casOpinion = document.querySelector("#casOpinion");
    var casTruth = document.querySelector("#casTruth");
    var casAssertion = document.querySelector("#casAssertion");
    var casConclusion = document.querySelector("#casConclusion");

    var argumentFromUser = casOpinion.value + " -> " + casTruth.value + " -> " + casAssertion.value + " -> " + casConclusion.value;
    console.log("Argument = " + argumentFromUser);

    /* Submit fields to database */
    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Expert Opinion Scheme",
        argumentDescription: argumentFromUser,
        opinion: casOpinion.value, 
        truth: casTruth.value,
        assertion: casAssertion.value,
        conclusion: casConclusion.value
    });

    /*----- Reset modal fields after argument submission ----*/
    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectArgumentScheme.selectedIndex = "reset";
    argumentForm.className = "hide";

    form.reset();

    casOpinion.remove();
    casTruth.remove();
    casAssertion.remove();
    casConclusion.remove();

    var argumentButton = document.getElementById("counterArgumentButton");
    argumentButton.remove();
});


/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------- Counter-argument functionality ----------------------------------------------------------------------------
 */

var setupEosCriticalQuestions = (function(data){
    var opinion; 
    var assertion; 
    var conclusion; 
    var truth; 

    data.forEach(function(d) {
        opinion = d.opinion; 
        assertion = d.assertion; 
        conclusion = d.conclusion; 
        truth = d.truth; 
    });

    createAndAppendEosCriticalQuestions(opinion, assertion); 
});

var createAndAppendEosCriticalQuestions = (function(expert, assertion) {
    for (let i=1; i<6; i++) {
        var tempCriticalQuestion = eosQuestionsSwitch(i, expert, assertion); 
        lib.addAndAppendOption(tempCriticalQuestion, i); 
    }

});

var eosQuestionsSwitch = (function(questionNumber, expert, assertion){
    switch (questionNumber) {
        case 1: 
            return "Is " + expert + " in a positon to know whether " + assertion + " is true?"; 
            break; 
        case 2: 
            return "What is it about " + expert + " that makes him/her likely to know about " + assertion + "?"; 
            break; 
        case 3: 
            return "Is " + expert + " an honest, trustworthy and reliable source?"; 
            break; 
        case 4: 
            return "Did " + expert + " really make an assertion that " + assertion + " is true or false?"; 
            break; 
        case 5: 
            return "Are we hearing about " + assertion + " first-hand or second-hand?"; 
            break; 
        default: 
            "Select a scheme to generate critical questions"; 
    }
});


export {createExpertOpinionForm, setupEosCriticalQuestions};