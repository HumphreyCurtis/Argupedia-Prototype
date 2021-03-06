/*
 * Importing argument schemes from schemes folder 
 *
 */
import * as cas from "./schemes/criticalActionScheme.js";
import * as apo from "./schemes/appealToPopularOpinion.js";
import * as afa from "./schemes/argumentFromAnalogy.js";
import * as acc from "./schemes/argumentFromCorrelationToCause.js";
import * as afc from "./schemes/argumentFromConsequences.js";
import * as ss from "./schemes/slipperySlopeArgument.js";
import * as afp from "./schemes/argumentFromPositionToKnow.js";
import * as eos from "./schemes/appealToExpertOpinion.js";

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


/* 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------- Functions needed for initial arguments ------------------------------------------------------------------- 
 */


/* 
 * Event listener which deduces whether user wants to create a counter argument or initial argument 
 */
selectTypeOfArgument.addEventListener('change', (event) => {

    // console.log("Value selected is = ", selectTypeOfArgument.value);

    if (selectTypeOfArgument.value == "initialArgument") {
        selectTypeOfArgument.disabled = true; /* To remove - search for 'disabled' */
        argumentStatus = "initialArgument";
        argumentForm.className = "show";
        // selectArgumentSchemeEventListener next function 

    } else if (selectTypeOfArgument.value == "counterArgument") {
        selectTypeOfArgument.disabled = true; /* ADDED RECENTLY */
        argumentStatus = "counterArgument";
        /* 
         * selectArgumentSchemeEventListener next function 
         * Piping in fields for counterargument using div counterargumentInputFields on modal
         */
        createInputFieldsForCounterArgument(counterArgumentInputFields, "Counter argument target name", "counterArgumentTargetName");
        appendSeeCriticalQuestionsButton(counterArgumentInputFields, "btn waves-effect white-text", "counterArgumentTargetButton");
        appendSelectCriticalQuestions(counterArgumentInputFields);
        appendConflictingClaims(counterArgumentInputFields);

        argumentForm.className = "show";

        counterArgumentEventListener();
    }

});

/* 
 * Event listener which listens to type of argument scheme to be selected e.g. critical action scheme 
 */
selectArgumentScheme.addEventListener('change', (event) => {
    console.log("Value selected is = " + selectArgumentScheme.value)

    if (selectArgumentScheme.value == "casForm") {
        selectArgumentScheme.disabled = true; 
        cas.createCasForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1, argumentStatus);

    } else if (selectArgumentScheme.value == "appealToExpertOpinion") {
        // console.log("Appeal to expert opinion selected");
        selectArgumentScheme.disabled = true; 
        eos.createEosForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1, argumentStatus);

    } else if (selectArgumentScheme.value == "appealToPopularOpinionForm") {
        // console.log("Appeal to popular opinion selected");
        selectArgumentScheme.disabled = true; 
        apo.createAppealToPopularOpinionForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1, argumentStatus);

    } else if (selectArgumentScheme.value == "argumentFromAnalogy") {
        // console.log("Argument from analogy selected");
        selectArgumentScheme.disabled = true; 
        afa.createArgumentFromAnalogyForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1, argumentStatus);

    } else if (selectArgumentScheme.value == "argumentFromCorrelationToCause") {
        // console.log("Argument from correlation to cause selected");
        selectArgumentScheme.disabled = true; 
        acc.createArgumentFromCorrelationToCauseForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1, argumentStatus);

    } else if (selectArgumentScheme.value == "argumentFromConsequences") {
        // console.log("Argument from consequences selected");
        selectArgumentScheme.disabled = true; 
        afc.createArgumentFromConsequencesForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1, argumentStatus);

    } else if (selectArgumentScheme.value == "slipperySlopeArgument") {
        // console.log("Slippery Slope Argument selected");
        selectArgumentScheme.disabled = true; 
        ss.createSlipperySlopeArgumentForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1, argumentStatus);

    } else if (selectArgumentScheme.value == "argumentFromPositionToKnow") {
        // console.log("Argument From Position to Know Selected");
        selectArgumentScheme.disabled = true; 
        afp.createArgumentFromPositionToKnowForm(argumentForm, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1, argumentStatus);

    }


});


/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------- Counter-argument functionality ----------------------------------------------------------------------------
 */

/*
 * Function to create input fields for counter-argument input on modal
 */
var createInputFieldsForCounterArgument = (function (elementToAppend, placeholder, id) {

    var inputField = document.createElement("input");
    
    inputField.setAttribute("type", "text");
    inputField.setAttribute("placeholder", placeholder);
    inputField.setAttribute("id", id);

    elementToAppend.append(inputField);
});

/*
 * Function which appends 'see critical questions' button to modal
 */
var appendSeeCriticalQuestionsButton = (function (elementToAppend, colour, id) {
    var div = document.createElement("div");
    div.setAttribute("class", "input-field");
    div.setAttribute("id", "buttonDiv");

    var button = document.createElement("btn");
    button.setAttribute("class", colour);
    button.textContent = "See critical questions";
    button.setAttribute("id", id);

    div.append(button);

    var div2 = document.createElement("div");
    div.append(div2);

    elementToAppend.append(div);
    // elementToAppend.append(button);
});

/*
 * Function which creates critical question opitions
 */
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

/*
 * Function which provides option for conflicting claims choice 
 */
var appendConflictingClaims = (function (elementToAppend) {

    var label = document.createElement("label");
    label.textContent = "Are the claims conflicting";
    label.setAttribute("id", "conflictingClaimsLabel");

    var select = document.createElement("select");
    select.setAttribute("class", "browser-default");
    select.setAttribute("id", "selectConflictingClaims")

    var noOption = document.createElement("option");
    noOption.textContent = "No";

    var yesOption = document.createElement("option");
    yesOption.textContent = "Yes";

    select.append(noOption);
    select.append(yesOption);

    elementToAppend.append(label);
    elementToAppend.append(select);
});

/*  
 * Function to create critical questions for user 
 */
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
                var scheme;

                query2 = querySnapshot.docs.map(doc => doc.data());
                // console.log(query2);
                // console.log("Empty array test on query = ", emptyArrayTest(query2));

                query2.forEach(function (d) {
                    scheme = d.scheme;
                });

                // console.log("Scheme of selected = " + scheme);
                schemeSwitch(scheme, query2);
            });

    });

});

/*
 * Function which switches between critical questions for each argument scheme 
 */
var schemeSwitch = (function (scheme, data) {
    switch (scheme) {
        case "Critical Action Scheme":
            // console.log("cas activating");
            return cas.setupCasCriticalQuestions(data);
            break;
        case "Appeal to Expert Opinion":
            // console.log("eos activating");
            return eos.setupEosCriticalQuestions(data);
            break;
        case "Appeal to Popular Opinion":
            // console.log("apo activating");
            return apo.setupApoCriticalQuestions(data);
            break;
        case "Argument from Analogy":
            // console.log("afa activating");
            return afa.setupAfaCriticalQuestions(data);
            break;
        case "Argument from Correlation to Cause":
            // console.log("acc activating");
            return acc.setupAccCriticalQuestions(data);
            break;
        case "Argument from Consequences":
            // console.log("afc activating");
            return afc.setupAfcCriticalQuestions(data);
            break;
        case "Slippery Slope Argument":
            // console.log("ss activating");
            return ss.setupSsCriticalQuestions(data);
            break;
        case "Argument from Position to Know":
            // console.log("afp activating");
            return afp.setupAfpCriticalQuestions(data);
            break;
        default:
            console.log("Add switch functionality");
            return "Not a valid scheme";

    }
});

/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */