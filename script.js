

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
    '+': add,
    '-': sub,
    '*': mul,
    '/': div,
};


function operate(op, num1, num2) {
    return OPERATOR_FNS[op](num1, num2);
}


const calc = {
    num1: 0,
    num2: 0,
    op: null,
    opJustPressed: false,

    equals: false,

    _display: '',
    _displayHistory: '',

    get display() {
        return this._display;
    },

    set display(txt) {
        this._display = txt;
        const display = document.querySelector('.display');
        display.textContent = txt;
    },

    get displayHistory() {
        return this._displayHistory;
    },

    set displayHistory(txt) {
        this._displayHistory = txt;
        const displayHistory = document.querySelector('.displayHistory');
        displayHistory.textContent = txt;
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
        if (this.opJustPressed) {
            this.display = '';
            this.opJustPressed = false;
        }
        this.appendDisplay(numStr);
    },

    btnOp(event) {
        const op = event.target.dataset.op;
        const opTxt = event.target.textContent;
        this.op = op;
        this.opJustPressed = true;
        this.num1 = Number(this.display);
        this.displayHistory = `${this.display} ${opTxt}`;
    },

    btnEquals() {
        this.num2 = Number(this.display);
        this.displayHistory = '';
        const result = operate(this.op, this.num1, this.num2);
        this.display = String(result);
    }

}


function main() {
    const btnNums = document.querySelectorAll('.keys-digit');
    for (const btnNum of btnNums) {
        btnNum.addEventListener('click', (event) => calc.btnNum(event));
    }

    const btnOps = document.querySelectorAll('.keys-operator');
    for (const btnOp of btnOps) {
        btnOp.addEventListener('click', (event) => calc.btnOp(event));
    }

    const btnEquals = document.querySelector('.keys-equals');
    btnEquals.addEventListener('click', () => calc.btnEquals())
}


main();