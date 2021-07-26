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

/* Function which updates variable status of number of arguments to create unique ID */
db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

});

var createArgumentFromConsequencesForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {
    lib.createArgumentForm(elementToAppend, "If A is brought about good/bad consequences will occur...", "afcPremise");
    lib.createArgumentForm(elementToAppend, "A should or should not be brought about...", "afcConclusion");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        afcSubmissionToDatabaseForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments);
        }
    });

});

var afcSubmissionToDatabaseForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var afcPremise = document.querySelector("#afcPremise");
    var afcConclusion = document.querySelector("#afcConclusion");

    var variables = []
    variables.push(afcPremise.value, afcConclusion.value); 
    test.fullVariableTesting(variables);

    var argumentFromUser = "Premise: " + afcPremise.value.toLowerCase() +  
    "<br></br>Conclusion: " + afcConclusion.value.toLowerCase();
    
    console.log("Argument = ", argumentFromUser);

    /* Submit fields to database */
    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Argument from Consequences",
        argumentDescription: argumentFromUser,
        afcPremise: afcPremise.value.toLowerCase(),
        conclusion: afcConclusion.value.toLowerCase()
    });

    /*----- Reset modal fields after argument submission ----*/
    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectArgumentScheme.selectedIndex = "reset";
    argumentForm.className = "hide";

    form.reset();

    afcPremise.remove();
    afcConclusion.remove();

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

var setupAfcCriticalQuestions = (function (data) {
    var afcPremise;
    var conclusion;

    data.forEach(function (d) {
        afcPremise = d.afcPremise,
            conclusion = d.conclusion
    });

    createAndAppendAfcCriticalQuestions(afcPremise, conclusion);
});

var createAndAppendAfcCriticalQuestions = (function (afcPremise, conclusion) {
    for (let i = 1; i < 5; i++) {
        var tempCriticalQuestion = afcQuestionsSwitch(i, afcPremise, conclusion); 
        lib.addAndAppendOption(tempCriticalQuestion, i);
    }
});

var afcQuestionsSwitch = (function (questionNumber, afcPremise, conclusion) {
    switch (questionNumber) {
        case 1:
            return "How strong is the probability or plausibility that these cited consequences will (may, might, must) occur?";
            break;  
        case 2: 
            return "What is the evidence supports the claim that these consequences will (may, might, must) occur?";
            break; 
        case 3:
            return "Are the consequences of the opposite value that ought to be taken into account?";
            break; 
        case 4: 
            return "Is \"" + conclusion + "\" really good or bad?"; 
            break; 
        default: 
            "Select a scheme to generate critical questions"; 
    }

});

export{
    createArgumentFromConsequencesForm,  
    setupAfcCriticalQuestions  
};