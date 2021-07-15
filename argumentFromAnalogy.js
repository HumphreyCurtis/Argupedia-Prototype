import * as lib from "./library.js";

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

var createArgumentFromAnalogyForm = (function (elementToAppend, id, buttonClass, buttonId, modalName, argumentStatus) {
    lib.createArgumentForm(elementToAppend, "Generally, case X is similar to case Y", "afaSimilarityPremise");
    lib.createArgumentForm(elementToAppend, "A is true in case X", "afaBasePremise");
    lib.createArgumentForm(elementToAppend, "A is probably true (false) in case Y", "afaConclusion");

    lib.appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        afaSubmissionToDatabaseForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            lib.counterArgumentSubmissionToDatabase(numberOfArguments);
        }
    });

});

var afaSubmissionToDatabaseForm = (function (id, modalName) {
    var form = document.getElementById(id);

    var similarityPremise = document.querySelector("#afaSimilarityPremise");
    var basePremise = document.querySelector("#afaBasePremise");
    var conclusion = document.querySelector("#afaConclusion");

    var argumentFromUser = similarityPremise.value + " -> " + basePremise.value + " -> " + conclusion.value;
    console.log("Argument = ", argumentFromUser);

    /* Submit fields to database */
    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        scheme: "Argument from Analogy",
        argumentDescription: argumentFromUser,
        similarityPremise: similarityPremise.value,
        basePremise: basePremise.value,
        conclusion: conclusion.value
    });

    /*----- Reset modal fields after argument submission ----*/
    var instance = M.Modal.getInstance(modalName);
    instance.close();

    selectTypeOfArgument.selectedIndex = "reset";
    selectArgumentScheme.selectedIndex = "reset";
    argumentForm.className = "hide";

    form.reset();

    similarityPremise.remove();
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

var setupAfaCriticalQuestions = (function (data) {
    var similarityPremise;
    var basePremise;
    var conclusion;

    data.forEach(function (d) {
        similarityPremise = d.similarityPremise,
        basePremise = d.basePremise,
        conclusion = d.conclusion
    });

    createAndAppendAfaCriticalQuestions(similarityPremise, basePremise, conclusion);
});

var createAndAppendAfaCriticalQuestions = (function (similarityPremise, basePremise, conclusion) {
    for (let i = 1; i < 4; i++) {
        var tempCriticalQuestion = afaQuestionsSwitch(i, similarityPremise, basePremise, conclusion); 
        lib.addAndAppendOption(tempCriticalQuestion, i); 
    }

});

var afaQuestionsSwitch = (function (questionNumber, similarityPremise, basePremise, conclusion) {
    switch (questionNumber) {
        case 1:
            return "In the example given " + basePremise + " is it really true or false?";
            break;
        case 2:
            return "Are there differences between the " + similarityPremise + " and " + basePremise + " that would tend to undermine the force of the similarity cited?";
            break;
        case 3:
            return "Is there some case unstated that is also similar to " + similarityPremise + " but in which the " + conclusion + " is true / false instead?"
            break;
        default:
            "Select a scheme to generate critical questions";
    }
});

export {
    createArgumentFromAnalogyForm, 
    setupAfaCriticalQuestions
};