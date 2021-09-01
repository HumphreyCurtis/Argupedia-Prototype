
/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------- Test file for usre input and unit testing  -------------------------------------------------
 */


var fullVariableTesting = (function (variables) {

    // console.log("Test variables array = ", variables);

    for (let i = 0; i < variables.length; i++) {
        var currentVariable = variables[i];
        if (emptyTest(currentVariable) || nullTest(currentVariable)) {
            alert("Invalid argument variables input by user");
            window.location.reload();
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
});


export {
    fullVariableTesting
};