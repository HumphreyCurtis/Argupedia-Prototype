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

var eosSubmissionToDatabaseForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var eosExpert = document.querySelector("#eosExpert");
    var eosDomain = document.querySelector("#eosDomain");
    var eosProposition = document.querySelector("#eosProposition");
    var eosAssertionPremise = document.querySelector("#eosAssertionPremise");
    var eosConclusion = document.querySelector("#eosConclusion");
    // console.log(eosExpert.value);
    // console.log(eosDomain.value); 
    // console.log(eosProposition.value); 
    // console.log(eosAssertionPremise.value); 
    // console.log(eosConclusion.value);

    var argumentFromUser = eosExpert.value + " -> " + eosDomain.value + " -> " + eosProposition.value + " -> " + eosAssertionPremise.value + " -> " + eosConclusion.value;
    console.log("Argument = " + argumentFromUser);

    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Appeal to Expert Opinion",
        argumentDescription: argumentFromUser,
        expert: eosExpert.value,
        domain: eosDomain.value,
        proposition: eosProposition.value,
        assertionPremise: eosAssertionPremise.value,
        conclusion: eosConclusion.value
    });

    /*----- Reset modal fields after argument submission ----*/
    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectArgumentScheme.selectedIndex = "reset";
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

var eosQuestionSwitch = (function(questionNumber, expert, domain, proposition, assertionPremise, conclusion) {
    switch(questionNumber) {
        case 1: 
            return "How credible is " + expert + " as an expert?"; 
            break; 
        case 2: 
            return "Is " + expert +  " actually an expert in the field that " + proposition + " is in?";  
            break; 
        case 3: 
            return "What did " + expert + " assert that implies " + proposition + "?"; 
            break; 
        case 4: 
            return "Is " + expert + " personally reliable and trustworthy? Do we have any reason to think that " + expert + " is less than hosest?"; 
            break; 
        case 5: 
            return "Is " + proposition + " consistent with what other experts have asserted?"; 
            break; 
        case 6: 
            return "Is the evidence provided by " + expert + " based on actual evidence?"; 
            break; 
        default: 
            "Select a scheme to generate a critical question"; 
    }
});

export {
    createEosForm,
    setupEosCriticalQuestions
};
