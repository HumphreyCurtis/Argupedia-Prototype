// Initialise modal
const modal = document.querySelector(".modal");

// Using materialise library to initialise modal 
M.Modal.init(modal);

// Initialise modal
const modal1 = document.getElementById("modal1");

// Using materialise library to initialise modal 
M.Modal.init(modal1);

// Event listener on argument scheme selected 
const selectElement = document.querySelector(".browser-default");

// Argument scheme selector
const argumentSchemeSelected = document.getElementById("selectArgumentScheme");

// Selecting and revealing forms
const actionSchemeForm = document.getElementById("criticalActionScheme");

// Number of arguments in debate
var numberOfArguments = 0;

const initialAddArgumentButton = document.getElementById("initialAddButton");


selectElement.addEventListener('change', (event) => {
    console.log("Value selected is:");
    console.log(argumentSchemeSelected.value);

    if (argumentSchemeSelected.value === "1") { // Will need to change to make better 
        actionSchemeForm.className = "show";
    } else {
        actionSchemeForm.className = "hide";
    }
});


db.collection("arguments").onSnapshot(function (querySnapshot) {

    console.log("Number of arguments = " + querySnapshot.docs.length);
    numberOfArguments = querySnapshot.docs.length;

    // if (numberOfArguments === 1) {
    //    initialAddButtonText.className = "hide";
    //    initialAddArgumentButton.className = "hide";
    // }

    if (numberOfArguments > 0) {
        initialAddArgumentButton.className = "hide"; // TEST TO SEE WORKS ON ZERO
    }
});


const form = document.querySelector("form");

// Critical aciton scheme parameters 
const casCircumstance = document.querySelector("#casCircumstance");
const casAction = document.querySelector("#casAction");
const casGoal = document.querySelector("#casGoal");
const casValue = document.querySelector("#casAction");
const casParent = null;

form.addEventListener("submit", e => {
    e.preventDefault();

    var argumentFromUser = casCircumstance.value + " -> " + casAction.value + " -> " + casGoal.value + " -> " + casValue.value;
    console.log("Initial argument = " + argumentFromUser);
    console.log("Number of arguments = " + numberOfArguments);

    db.collection("arguments").add({
        name: "argument" + numberOfArguments,
        argumentDescription: argumentFromUser,
        value: casCircumstance.value,
        action: casAction.value,
        goal: casGoal.value,
        value: casValue.value
    });

    var instance = M.Modal.getInstance(modal);
    instance.close();

    form.reset();
});

// SETTING UP COUNTER-ARGUMENT

// Initial argument button and text

// Need to perform empty tests / null tests !!!!

const counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");

const criticalQuestionsForSelection = document.getElementById("selectCriticalQuestion");

const counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");

counterArgumentTargetButton.addEventListener("click", function () {

    var counterArgumentTargetNameValue = counterArgumentTargetName.value;

    console.log("Counter argument target name = " + counterArgumentTargetNameValue);


    var arguments = db.collection("arguments");

    var query = arguments.where("name", "==", "argument0").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });


    var query2 = arguments.where("name", "==", "argument0").get()
        .then(querySnapshot => {
            query2 = querySnapshot.docs.map(doc => doc.data())
            console.log(query2);
            query2.forEach(function (d) {
                console.log(d.name); // KEY accessing data name
                console.log(d.circumstance);
                console.log(d.action);
                console.log(d.goal)
                console.log(d.value);
            });
        });



    // var opt1 = document.createElement("option");
    // opt1.value = "1";
    // opt1.text = "Are the believed circumstances true";
    // criticalQuestionsForSelection.add(opt1);

    for (let i = 1; i < 17; i++) {
        console.log(i);
        var tempCriticalQuestion = criticalQuestions(i, "Humphrey", "Humphrey", "Humphrey", "Humphrey", "Humphrey", "Humphrey");
        addAndAppendOption(tempCriticalQuestion, i);
    }

});



var criticalQuestions = (function (questionNumber, currentCircumstance, action, goal, value, newCircumstances) {

    // var q1 = "Are the believed " + currentCircumstance + " true?";
    // var q2 = "Assuming the " + currentCircumstance + ", does the " + action + " have the stated consequences";
    // var q3 = "Assuming the " + currentCircumstance + " and that the " + action + " has the stated consequences, will the " + action + " bring about the desired " + goal;
    // var q4 = "Does the " + goal + " realise the " + value + " stated?";
    // var q5 = "Are there alternative ways of realising the same " + goal + "?";
    // var q6 = "Are there alternative ways of realising the same " + consequences + "?";
    // var q7 = "Are there alternative ways of promoting the same " + value + "?";
    // var q8 = "Does doing the action have a side effect which demotes the " + value + "?";
    // var q9 = "Does the " + action + " have a side effect which demotes some other value?";
    // var q10 = "Does doing the " + action + " promote some other " + value;
    // var q11 = "Does doing the " + action + "preclude some other action which would promote some other value?";
    // var q12 = "Are the " + newCircumstances + " as desired possible";
    // var q13 = "Is the " + action + " possible?";
    // var q14 = "Are the " + newCircumstances + " as described possible?"
    // var q15 = "Can the desired " + goal + " be realised?";
    // var q16 = "Is the " + value + " indeed a legitimate value?"

    switch (questionNumber) {
        case 1:
            return "Are the believed " + currentCircumstance + " true?";
            break;
        case 2:
            return "Assuming the " + currentCircumstance + ", does the " + action + " have the stated consequences?";
            break;
        case 3:
            return "Assuming the " + currentCircumstance + " and that the " + action + " has the stated " + newCircumstances + ", will the " + action + " bring about the desired " + goal;
            break;
        case 4:
            return "Does the " + goal + " realise the " + value + " stated?";
            break;
        case 5:
            return "Are there alternative ways of realising the same " + newCircumstances + "?";
            break;
        case 6:
            return "Are there alternative ways of realising the same " + goal + "?";
            break;
        case 7:
            return "Are there alternative ways of promoting the same " + value + "?";
            break;
        case 8:
            return "Does doing the " + action + " have a side effect which demotes the " + value + "?";
            break;
        case 9:
            return "Does the " + action + " have a side effect which demotes some other value?";
            break;
        case 10:
            return "Does doing the " + action + " promote some other value?";
            break;
        case 11:
            return "Does doing the " + action + " preclude some other action which would promote some other value?";
            break;
        case 12:
            return "Are the " + newCircumstances + " as desired possible";
            break;
        case 13:
            return "Is the " + action + " possible?";
            break;
        case 14:
            return "Are the " + newCircumstances + " as described possible?"
            break;
        case 15:
            return "Can the desired " + goal + " be realised?";
            break;
        case 16:
            return "Is the " + value + " indeed a legitimate value?";
            break;
        default:
            "Select a scheme to generate critical questions";
    }

});

var addAndAppendOption = (function (criticalQuestion, valueNumber) {
    var option = document.createElement("option");
    option.value = valueNumber;
    option.text = criticalQuestion;
    criticalQuestionsForSelection.add(option);
});