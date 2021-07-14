import * as cas from "../criticalActionScheme.js"; 
/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------- Key global variables ----------------------------------------------------------------------- 
 */


/* Using materialise library to initialise modal */
const modal1 = document.getElementById("modal1");
M.Modal.init(modal1);

const selectTypeOfArgument = document.getElementById("selectArgument");

const selectArgumentScheme = document.getElementById("selectArgumentScheme2");

const argumentForm = document.getElementById("counterArgumentScheme");

const counterArgumentInputFields = document.getElementById("counterArgumentInputFields");

var argumentStatus = null;

var numberOfArguments = 0;


/* 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------- Functions needed for initial arguments ------------------------------------------------------------------- 
 */


/* Function which updates variable status of number of arguments to create unique ID */
db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

});

/* Event listener which deduces whether user wants to create a counter argument or initial argument */
selectTypeOfArgument.addEventListener('change', (event) => {

    console.log("Value selected is = ", selectTypeOfArgument.value);

    if (selectTypeOfArgument.value == "initialArgument") {

        argumentForm.className = "show";
        argumentStatus = "initialArgument";
        // counterArgumentSelectElementEventListener next function 

    } else if (selectTypeOfArgument.value == "counterArgument") {

        argumentStatus = "counterArgument";
        // counterArgumentSelectElementEventListener next function 

        /* Piping in fields for counter argument using div counterargumentInputFields */
        createInputFieldsForCounterArgument(counterArgumentInputFields, "Counter argument target name", "counterArgumentTargetName");
        appendSeeCriticalQuestionsButton(counterArgumentInputFields, "btn waves-effect white-text", "counterArgumentTargetButton");
        appendSelectCriticalQuestions(counterArgumentInputFields);
        argumentForm.className = "show";

        counterArgumentEventListener();
    }

});

/* Event listener which listens to type of argument scheme to be selected e.g. critical action scheme */
selectArgumentScheme.addEventListener('change', (event) => {
    console.log("Value selected is = " + selectArgumentScheme.value)

    if (selectArgumentScheme.value == "casForm") {
        // argumentForm.className = "show";
        cas.createCasForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1, argumentStatus);
    } else if (selectArgumentScheme.value == "expertForm") {
        console.log("Expert opinion scheme selected");
        createExpertOpinionForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1);
    }


});

/* Function to create Cas form for database */
// var createCasForm = (function (elementToAppend, id, buttonClass, buttonId, modalName) {

//     createArgumentForm(elementToAppend, "In the current circumstance...", "casCircumstance");
//     createArgumentForm(elementToAppend, "We should perform the action...", "casAction");
//     createArgumentForm(elementToAppend, "Which would result in new circumstances...", "casNewCircumstance");
//     createArgumentForm(elementToAppend, "Which will realise goal...", "casGoal");
//     createArgumentForm(elementToAppend, "Which will promote value...", "casValue");

//     appendArgumentButton(elementToAppend, buttonClass, buttonId);
//     var argumentSubmissionButton = document.getElementById(buttonId);

//     argumentSubmissionButton.addEventListener("click", function () { 
//         console.log("Hello"); 
//         casSubmissionToDatabaseFromForm(id, modalName);

//         if (argumentStatus == "counterArgument") {
//             counterArgumentSubmissionToDatabase();
//         }
//     });

// });

var createExpertOpinionForm = (function (elementToAppend, id, buttonClass, buttonId, modalName) {
    createArgumentForm(elementToAppend, "X is in the position to know...", "casOpinion");
    createArgumentForm(elementToAppend, "Whether A is true or false...", "casTruth");
    createArgumentForm(elementToAppend, "X asserts that A is true or false...", "casAssertion");
    createArgumentForm(elementToAppend, "A may be plausibly taken to be true or false...", "casConclusion");

    appendArgumentButton(elementToAppend, buttonClass, buttonId);
    var argumentSubmissionButton = document.getElementById(buttonId);

    argumentSubmissionButton.addEventListener("click", function () {
        console.log("Hello 2"); 
        eosSubmissionToDatabaseFromForm(id, modalName);

        if (argumentStatus == "counterArgument") {
            counterArgumentSubmissionToDatabase(); 
        }
    });
});

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

/* Function which submits CAS form to database */
// var casSubmissionToDatabaseFromForm = (function (id, modalName) {

//     var form = document.getElementById(id);
//     var casCircumstance = document.querySelector("#casCircumstance");
//     var casAction = document.querySelector("#casAction");
//     var casNewCircumstance = document.querySelector("#casNewCircumstance");
//     var casGoal = document.querySelector("#casGoal");
//     var casValue = document.querySelector("#casValue");

//     userArgumentVariableTests(casCircumstance.value, casAction.value, casNewCircumstance.value, casGoal.value, casValue.value);

//     var argumentFromUser = casCircumstance.value.toLowerCase() + " -> " + casAction.value.toLowerCase() + " -> " + casNewCircumstance.value.toLowerCase() + " -> " + casGoal.value.toLowerCase() + " -> " + casValue.value.toLowerCase();
//     console.log("Argument = " + argumentFromUser);

//     /* Submit fields to database */
//     db.collection("arguments").add({
//         name: "argument" + numberOfArguments,
//         scheme: "Critical Action Scheme",
//         argumentDescription: argumentFromUser,
//         currentCircumstance: casCircumstance.value.toLowerCase(),
//         action: casAction.value.toLowerCase(),
//         newCircumstance: casNewCircumstance.value.toLowerCase(),
//         goal: casGoal.value.toLowerCase(),
//         value: casValue.value.toLowerCase()
//     });

//     /*----- Reset modal fields after argument submission ----*/
//     var instance = M.Modal.getInstance(modalName);
//     instance.close();

//     selectTypeOfArgument.selectedIndex = "reset";
//     selectArgumentScheme.selectedIndex = "reset";
//     argumentForm.className = "hide";

//     form.reset();
//     casCircumstance.remove();
//     casAction.remove();
//     casNewCircumstance.remove();
//     casGoal.remove();
//     casValue.remove();

//     var argumentButton = document.getElementById("counterArgumentButton");
//     argumentButton.remove();
// });

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


var createInputFieldsForCounterArgument = (function (elementToAppend, placeholder, id) {

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

var appendSeeCriticalQuestionsButton = (function (elementToAppend, colour, id) {
    var div = document.createElement("div");
    div.setAttribute("class", "input-field");

    var button = document.createElement("btn");
    button.setAttribute("class", colour);
    button.textContent = "See critical questions";
    button.setAttribute("id", id);

    div.append(button);

    var div2 = document.createElement("div");
    div.append(div2);


    elementToAppend.append(div);
});

var appendSelectCriticalQuestions = (function (elementToAppend) {

    var label = document.createElement("label");
    label.textContent = "Select a critical question";
    label.setAttribute("id", "selectCriticalQuestionLabel");

    var select = document.createElement("select");
    select.setAttribute("class", "browser-default");
    select.setAttribute("id", "selectCriticalQuestion")

    var option = document.createElement("option");
    option.textContent = "Choose your option";

    select.append(option);

    elementToAppend.append(label);
    elementToAppend.append(select);
});

/* Function to create critical questions for user */
var counterArgumentEventListener = (function () {

    var counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");
    var counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");

    // Will have to adapt to work for multiple different types of scheme 
    counterArgumentTargetButton.addEventListener("click", function () {

        var counterArgumentTargetNameValue = counterArgumentTargetName.value;
        var args = db.collection("arguments");

        console.log("Counter argument target name = " + counterArgumentTargetNameValue);

        // Generating critical questions - rename variables
        var query2 = args.where("name", "==", counterArgumentTargetNameValue).get()
            .then(querySnapshot => {
                query2 = querySnapshot.docs.map(doc => doc.data())
                console.log(query2);
                console.log("Empty array test on query = ", emptyArrayTest(query2));

                var scheme;

                query2.forEach(function (d) {
                    scheme = d.scheme;
                });

                console.log("Scheme of selected = " + scheme);
                schemeSwitch(scheme, query2);

                // query2.forEach(function (d) {

                //     var currentCircumstance = d.currentCircumstance;
                //     var action = d.action;
                //     var newCircumstance = d.newCircumstance;
                //     var goal = d.goal;
                //     var value = d.value;

                //     createAndAppendCriticalQuestions(currentCircumstance, action, goal, value, newCircumstance);
                // });

            });

    });

});

var schemeSwitch = (function (scheme, data) {
    switch (scheme) {
        case "Expert Opinion Scheme":
            return setupEosCriticalQuestions(data); 
            break;
        case "Critical Action Scheme":
            console.log("cas activating"); 
            return cas.setupCasCriticalQuestions(data); 
            break;
        default:
            return "Not a valid scheme";

    }
});

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

// var setupCasCriticalQuestions = (function(data) {
//     var currentCircumstance;
//     var action; 
//     var newCircumstance; 
//     var goal; 
//     var value; 

//     data.forEach(function (d) {
//         currentCircumstance = d.currentCircumstance;
//         action = d.action;
//         newCircumstance = d.newCircumstance;
//         goal = d.goal;
//         value = d.value;
//     });

//     createAndAppendCriticalQuestions(currentCircumstance, action, goal, value, newCircumstance);
// });

var createAndAppendEosCriticalQuestions = (function(expert, assertion) {
    for (let i=1; i<6; i++) {
        var tempCriticalQuestion = eosQuestionsSwitch(i, expert, assertion); 
        addAndAppendOption(tempCriticalQuestion, i); 
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

// var createAndAppendCriticalQuestions = (function (currentCircumstance, action, goal, value, newCircumstances) {
//     for (let i = 1; i < 17; i++) {
//         var tempCriticalQuestion = casCriticalQuestionsSwitch(i, currentCircumstance, action, goal, value, newCircumstances);
//         addAndAppendOption(tempCriticalQuestion, i);
//     }
// });

// var casCriticalQuestionsSwitch = (function (questionNumber, currentCircumstance, action, goal, value, newCircumstances) {

//     switch (questionNumber) {
//         case 1:
//             return "Are the believed " + currentCircumstance + " true?";
//             break;
//         case 2:
//             return "Assuming the " + currentCircumstance + ", does the " + action + " have the stated consequences?";
//             break;
//         case 3:
//             return "Assuming the " + currentCircumstance + " and that the " + action + " has the stated " + newCircumstances + ", will the " + action + " bring about the desired " + goal + "?";
//             break;
//         case 4:
//             return "Does the " + goal + " realise the " + value + " stated?";
//             break;
//         case 5:
//             return "Are there alternative ways of realising the same " + newCircumstances + "?";
//             break;
//         case 6:
//             return "Are there alternative ways of realising the same " + goal + "?";
//             break;
//         case 7:
//             return "Are there alternative ways of promoting the same " + value + "?";
//             break;
//         case 8:
//             return "Does doing the " + action + " have a side effect which demotes the " + value + "?";
//             break;
//         case 9:
//             return "Does the " + action + " have a side effect which demotes some other value?";
//             break;
//         case 10:
//             return "Does doing the " + action + " promote some other value?";
//             break;
//         case 11:
//             return "Does doing the " + action + " preclude some other action which would promote some other value?";
//             break;
//         case 12:
//             return "Are the " + currentCircumstance + " as described possible?";
//             break;
//         case 13:
//             return "Is the " + action + " possible?";
//             break;
//         case 14:
//             return "Are the " + newCircumstances + " as described possible?"
//             break;
//         case 15:
//             return "Can the desired " + goal + " be realised?";
//             break;
//         case 16:
//             return "Is the " + value + " indeed a legitimate value?";
//             break;
//         default:
//             "Select a scheme to generate critical questions";
//     }

// });

var addAndAppendOption = (function (criticalQuestion, valueNumber) {
    var criticalQuestionsForSelection = document.getElementById("selectCriticalQuestion");
    var option = document.createElement("option");
    option.value = valueNumber;
    option.text = criticalQuestion;
    criticalQuestionsForSelection.add(option);
});

/* 
* Function for creating links to add to collection within database 
* Removing all necessary fields to clean up after submission
*
*/
var counterArgumentSubmissionToDatabase = (function () {

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

/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------Tests to perform on variables before database submission----------------------------------------------------------------
 */


var userArgumentVariableTests = (function (circumstance, action, newCircumstance, goal, value) {
    var variables = [];

    variables.push(circumstance, action, newCircumstance, goal, value);

    console.log("Test variables array = ", variables);

    for (let i = 0; i < variables.length; i++) {
        var currentVariable = variables[i];
        if (emptyTest(currentVariable) || nullTest(currentVariable)) {
            alert("Invalid argument variables input by user");
        }
    }
});

var emptyTest = (function (input) {
    if (nullTest(input) == false) {
        if (input.length > 0) {
            return false;
        }
        return true;
    }
    return true;
});

var nullTest = (function (input) {
    if (input == null) {
        return true;
    }
    return false;
});

var emptyArrayTest = (function (input) {
    if (input.length > 0) {
        return false;
    }
    return true;
})

/*------------------------------------------------------------------------------------Unit tests---------------------------------------------------------------------------------- */
//  let x = null; 
//  let y = "";
//  let z = "hello";

//  console.log(nullTest(x));
//  console.log(emptyTest(x));
//  console.log(emptyTest(y));
//  console.log(emptyTest(z));
//  console.log(nullTest(z)); 

// let circumstanceTest = "circumstance"; 
// let actionTest = "action"; 
// let newCircumstanceTest = "newCircumstance"; 
// let goalTest = "goalTest"; 

// userArgumentVariableTests(circumstanceTest, actionTest, newCircumstanceTest, goalTest); 

// let arrayTest = []; 
// console.log(emptyArrayTest(arrayTest)); 


/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */