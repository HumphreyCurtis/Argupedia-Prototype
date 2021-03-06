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

    // console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;
});

/*
 * Function which creates appeal to expert opinion form and has event listener for submission of form 
 * Also recognises if user is submitting counter-attacking argument
 * 
 */
var createEosForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {

    lib.createArgumentForm(elementToAppend, "Expert E...", "eosExpert");
    lib.createArgumentForm(elementToAppend, "Is an expert in domain D...", "eosDomain");
    lib.createArgumentForm(elementToAppend, "Containing proposition A...", "eosProposition");
    lib.createArgumentForm(elementToAppend, "E asserts that A (in domain D) is true (or false)...", "eosAssertionPremise");
    lib.createArgumentForm(elementToAppend, "A may be plausibly taken to be true", "eosConclusion");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        eosSubmissionToDatabaseForm(id, modalName); 

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments);
        }
    });
});

/*
 * Function which performs submission to database of user inputted data 
 *
 */
var eosSubmissionToDatabaseForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var eosExpert = document.querySelector("#eosExpert");
    var eosDomain = document.querySelector("#eosDomain");
    var eosProposition = document.querySelector("#eosProposition");
    var eosAssertionPremise = document.querySelector("#eosAssertionPremise");
    var eosConclusion = document.querySelector("#eosConclusion");


    var variables = []; 
    variables.push(eosExpert.value, eosDomain.value, eosProposition.value, eosAssertionPremise.value, eosConclusion.value); 
    test.fullVariableTesting(variables);

    // var argumentFromUser = eosExpert.value + " -> " + eosDomain.value + " -> " + eosProposition.value + " -> " + eosAssertionPremise.value + " -> " + eosConclusion.value;
    var argumentFromUser = "Expert: " + eosExpert.value.toLowerCase() + 
    "<br></br>With the subject of: " + eosDomain.value.toLowerCase() + 
    "<br></br>Containing the proposition: " + eosProposition.value.toLowerCase() + 
    "<br></br>Assertion premise: " + eosAssertionPremise.value.toLowerCase() +
    "<br></br>Conclusion: " + eosConclusion.value.toLowerCase(); 
    
    // console.log("Argument = " + argumentFromUser);

    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Appeal to Expert Opinion",
        argumentDescription: argumentFromUser,
        expert: eosExpert.value.toLowerCase(),
        domain: eosDomain.value.toLowerCase(),
        proposition: eosProposition.value.toLowerCase(),
        assertionPremise: eosAssertionPremise.value.toLowerCase(),
        conclusion: eosConclusion.value.toLowerCase()
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

    eosExpert.remove(); 
    eosDomain.remove(); 
    eosProposition.remove(); 
    eosAssertionPremise.remove(); 
    eosConclusion.remove(); 

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
var setupEosCriticalQuestions = (function (data) {
    var expert; 
    var domain; 
    var proposition; 
    var assertionPremise; 
    var conclusion; 

    data.forEach(function(d){
        expert = d.expert; 
        domain = d.domain; 
        proposition = d.proposition; 
        assertionPremise = d.assertionPremise;
        conclusion = d.conclusion; 
    });

    createAndAppendEosCriticalQuestions(expert, domain, proposition, assertionPremise, conclusion); 
})

var createAndAppendEosCriticalQuestions = (function(expert, domain, proposition, assertionPremise, conclusion){
    for (let i=1; i<7; i++){
        var tempCriticalQuestion = eosQuestionSwitch(i, expert, domain, proposition, assertionPremise, conclusion); 
        lib.addAndAppendOption(tempCriticalQuestion); 
    }
});

/*
 * E - expert
 * D - domain
 * A - proposition
 * 
 */
var eosQuestionSwitch = (function(questionNumber, expert, domain, proposition, assertionPremise, conclusion) {
    switch(questionNumber) {
        case 1: 
            return "How credible is \"" + expert + "\" as an expert?"; 
            break; 
        case 2: 
            return "Is \"" + expert +  "\" actually an expert in the field that \"" + proposition + "\" is in?";  
            break; 
        case 3: 
            return "What did \"" + expert + "\" assert that implies \"" + proposition + "\"?"; 
            break; 
        case 4: 
            return "Is \"" + expert + "\" personally reliable and trustworthy? Do we have any reason to think that \"" + expert + "\" is less than honest?"; 
            break; 
        case 5: 
            return "Is \"" + proposition + "\" consistent with what other experts have asserted?"; 
            break; 
        case 6: 
            return "Is the evidence provided by \"" + expert + "\" based on actual evidence?"; 
            break; 
        default: 
            "Select a scheme to generate a critical question"; 
    }
});

export {
    createEosForm,
    setupEosCriticalQuestions
};
