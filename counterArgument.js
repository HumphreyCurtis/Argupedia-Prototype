import { createCasForm, casSubmissionToDatabaseFromForm, createArgumentForm, appendArgumentButton } from "./index.js";
// Initialise modal
const modal1 = document.getElementById("modal1");

// Using materialise library to initialise modal 
M.Modal.init(modal1);

const counterArgumentTargetButton = document.getElementById("counterArgumentTargetButton");

const criticalQuestionsForSelection = document.getElementById("selectCriticalQuestion");

const counterArgumentTargetName = document.querySelector("#counterArgumentTargetName");

const counterArgumentSelectElement = document.getElementById("selectArgumentScheme2");

const counterArgumentScheme = document.getElementById("counterArgumentScheme");


counterArgumentSelectElement.addEventListener('change', (event) => {
    console.log("Value selected is = " + counterArgumentSelectElement.value)

    if (counterArgumentSelectElement.value == 1) {
        counterArgumentScheme.className = "show";
        createCasForm(counterArgumentScheme, "counterArgumentScheme", "btn waves white-text", "counterArgumentButton", modal1);
    }


});



counterArgumentTargetButton.addEventListener("click", function () {

    var counterArgumentTargetNameValue = counterArgumentTargetName.value;

    console.log("Counter argument target name = " + counterArgumentTargetNameValue);


    var args = db.collection("arguments");

    // var query = arguments.where("name", "==", "argument0").get().then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             // doc.data() is never undefined for query doc snapshots
    //             console.log(doc.id, " => ", doc.data());
    //         });
    //     })
    //     .catch((error) => {
    //         console.log("Error getting documents: ", error);
    //     });

    // Generating critical questions - rename variables
    var query2 = args.where("name", "==", counterArgumentTargetNameValue).get()
        .then(querySnapshot => {
            query2 = querySnapshot.docs.map(doc => doc.data())
            console.log(query2);
            query2.forEach(function (d) {

                var currentCircumstance = d.currentCircumstance;
                var action = d.action;
                var newCircumstance = d.newCircumstance;
                var goal = d.goal;
                var value = d.value;

                createAndAppendCriticalQuestions(currentCircumstance, action, goal, value, newCircumstance);
            });

        });

});

var createAndAppendCriticalQuestions = (function (currentCircumstance, action, goal, value, newCircumstances) {
    for (let i = 1; i < 17; i++) {
        var tempCriticalQuestion = casCriticalQuestionsSwitch(i, currentCircumstance, action, goal, value, newCircumstances);
        addAndAppendOption(tempCriticalQuestion, i);
    }
});



var casCriticalQuestionsSwitch = (function (questionNumber, currentCircumstance, action, goal, value, newCircumstances) {

    switch (questionNumber) {
        case 1:
            return "Are the believed " + currentCircumstance + " true?";
            break;
        case 2:
            return "Assuming the " + currentCircumstance + ", does the " + action + " have the stated consequences?";
            break;
        case 3:
            return "Assuming the " + currentCircumstance + " and that the " + action + " has the stated " + newCircumstances + ", will the " + action + " bring about the desired " + goal + "?";
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
            return "Are the " + currentCircumstance + " as described possible?";
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

// const counterArgumentScheme = document.getElementById("counterArgumentScheme");

// var createArgumentForm = (function (elementToAppend, placeholder, id) {
//     // var casForm = document.createElement("form"); 
//     // casForm.setAttribute("class", "show"); 
//     // casForm.setAttribute("id", "counterArgumentScheme"); 

//     var div = document.createElement("div");
//     div.setAttribute("class", "input-field");

//     var inputField = document.createElement("input");
//     inputField.setAttribute("type", "text");
//     inputField.setAttribute("placeholder", placeholder);
//     inputField.setAttribute("id", id);

//     div.append(inputField);

//     var div2 = document.createElement("div");
//     div.append(div2);

//     elementToAppend.append(div);
// });