import * as cas from "./criticalActionScheme.js";
import * as eos from "./expertOpinionScheme.js";  
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

// var numberOfArguments = 0;


/* 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------- Functions needed for initial arguments ------------------------------------------------------------------- 
 */


/* Function which updates variable status of number of arguments to create unique ID */
// db.collection("arguments").onSnapshot(function (querySnapshot) {

//     console.log("Number of arguments = " + querySnapshot.docs.length);
//     numberOfArguments = querySnapshot.docs.length;

// });

/* Event listener which deduces whether user wants to create a counter argument or initial argument */
selectTypeOfArgument.addEventListener('change', (event) => {

    console.log("Value selected is = ", selectTypeOfArgument.value);

    if (selectTypeOfArgument.value == "initialArgument") {

        argumentStatus = "initialArgument";
        argumentForm.className = "show";
        // selectArgumentSchemeEventListener next function 

    } else if (selectTypeOfArgument.value == "counterArgument") {

        argumentStatus = "counterArgument";
        // selectArgumentSchemeEventListener next function 

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
        // console.log("Expert opinion scheme selected");
        eos.createExpertOpinionForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1, argumentStatus);
    }


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
            return eos.setupEosCriticalQuestions(data); 
            break;
        case "Critical Action Scheme":
            console.log("cas activating"); 
            return cas.setupCasCriticalQuestions(data); 
            break;
        default:
            return "Not a valid scheme";

    }
});

/* MOVE TO NEW FILE CALLED UNIT TESTS */
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