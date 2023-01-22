

function add(num1, num2) {
    return num1 + num2;
}


function sub(num1, num2) {
    return num1 - num2;
}


function mul(num1, num2) {
    return num1 * num2;
}


function div(num1, num2) {
    return num1 / num2;
}


const OPERATOR_FNS = {
    add,
    sub,
    mul,
    div,
};


function operate(op, num1, num2) {
    return OPERATOR_FNS[op](num1, num2);
}

