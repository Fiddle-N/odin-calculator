const OPERATORS = {
    ADD: '+',
    SUB: '-',
    MUL: '*',
    DIV: '/',
}


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


const calc = {
    num1: 0,
    num2: 0,
    op: null,

    _display: '',

    get display() {
        return this._display;
    },

    set display(txt) {
        this._display = txt;
        const display = document.querySelector('.display');
        display.textContent = txt;
    },

    appendDisplay(digit) {
        if (this.display === '0') {
            this.display = digit;
        }
        else {
            this.display += digit;
        }
    },

    btnNum(event) {
        const numStr = event.target.textContent;
        this.appendDisplay(numStr);
    } 

}


function main() {
    const btnNums = document.querySelectorAll('.keys-digit');
    for (const btnNum of btnNums) {
        btnNum.addEventListener('click', (event) => calc.btnNum(event));
    }
}


main();