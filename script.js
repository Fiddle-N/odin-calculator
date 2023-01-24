

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

const OP_TO_OP_STR = {
    '+': '+',
    '-': '-',
    '*': '×',
    '/': '÷',
}

function operate(op, num1, num2) {
    return OPERATOR_FNS[op](num1, num2);
}

const CALC_STATES = {
    NUM_PRESSED: 0,
    OP_PRESSED: 1,
    EQUALS_PRESSED: 2,
    ZERO_DIV: 3,
}

const calc = {
    num1: null,
    num2: null,
    op: null,

    state: null,

    opJustPressed: false,
    equalsJustPressed: false,
    zeroDiv: false,

    get display() {
        const display = document.querySelector('.display');
        return display.textContent;
    },

    set display(txt) {
        const display = document.querySelector('.display');
        display.textContent = txt;
    },

    get displayHistory() {
        const displayHistory = document.querySelector('.displayHistory');
        return displayHistory.textContent;
    },

    set displayHistory(txt) {
        this._displayHistory = txt;
        const displayHistory = document.querySelector('.displayHistory');
        displayHistory.textContent = txt;
    },

    appendDisplayDigit(digit) {
        if (this.display === '0') {
            this.display = digit;
        }
        else {
            this.display += digit;
        }
    },

    disableKeyUponZeroDiv() {
        const keysToBeDisabled = document.querySelectorAll('.keys-disableOnZeroDivision');
        for (const key of keysToBeDisabled) {
            key.disabled = true;
        }
    },

    enableKeyUponZeroDiv() {
        const keysToBeDisabled = document.querySelectorAll('.keys-disableOnZeroDivision');
        for (const key of keysToBeDisabled) {
            key.disabled = false;
        }
    },

    removeDisplayDigit() {
        this.display = this.display.slice(0, -1);
        if (this.display === '') {
            this.display = '0';
        }
    },

    btnNum(event) {
        if (this.zeroDiv) {
            this.btnC();
            this.enableKeyUponZeroDiv()
            this.zeroDiv = false;
        }

        const numStr = event.target.textContent;
        if (this.opJustPressed) {
            this.display = '';
            this.opJustPressed = false;
            if (this.equalsJustPressed) {
                this.equalsJustPressed = false;
            }
        }
        else if (this.equalsJustPressed) {
            this.num1 = null;
            this.num2 = null;
            this.display = '';
            this.displayHistory = '';
            this.equalsJustPressed = false;
        }
        this.appendDisplayDigit(numStr);
        this.state = CALC_STATES.NUM_PRESSED;
    },

    btnOp(event) {      
        if (!this.num1) {
            this.num1 = Number(this.display);
            this.num2 = null;

            const op = event.target.dataset.op;
            const opTxt = event.target.textContent;

            this.op = op;
            this.opJustPressed = true;
            this.displayHistory = `${this.num1} ${opTxt}`;
        }

        else if (this.opJustPressed) {
            const op = event.target.dataset.op;
            if (this.op === op) {
                return;
            }
            const opTxt = event.target.textContent;
            this.op = op;
            this.displayHistory = `${this.display} ${opTxt}`;
        }
        else if (this.equalsJustPressed) {
            this.num1 = Number(this.display);
            this.num2 = null;

            const op = event.target.dataset.op;
            const opTxt = event.target.textContent;

            this.op = op;
            this.opJustPressed = true;
            this.displayHistory = `${this.display} ${opTxt}`;

            this.equalsJustPressed = false;
        }
        else if (this.num1) {
            const op = event.target.dataset.op;
            const opTxt = event.target.textContent;

            this.btnEquals();
            if (this.zeroDiv) {
                this.displayHistory = `${this.num1} ${OP_TO_OP_STR[this.op]} ${this.num2} ${opTxt}`;
                return;
            } 

            this.num1 = Number(this.display);
            this.num2 = null;

            this.op = op;
            this.opJustPressed = true;
            this.displayHistory = `${this.display} ${opTxt}`;
        }
        else {
            this.op = op;
            this.opJustPressed = true;
            this.num1 = Number(this.display);
            this.displayHistory = `${this.display} ${opTxt}`;
        }
        this.state = CALC_STATES.OP_PRESSED;
    },

    btnEquals() {
        if (this.zeroDiv) {
            this.btnC();
            this.enableKeyUponZeroDiv();
            this.zeroDiv = false;
            return;
        }

        if (this.op === '/' && this.display === '0'){
            this.num2 = Number(this.display);
            this.display = 'Cannot divide by zero';
            this.disableKeyUponZeroDiv();
            this.zeroDiv = true;
            return;
        }

        if (!this.op){
            this.displayHistory = `${this.display} =`;
            this.display = String(this.display);
            this.equalsJustPressed = true;
            this.state = CALC_STATES.EQUALS_PRESSED;
            return;
        }

        if (this.equalsJustPressed) {
            this.num1 = Number(this.display);
        }
        else {
            this.num2 = Number(this.display);
        }
        this.displayHistory = `${this.num1} ${OP_TO_OP_STR[this.op]} ${this.num2} =`;
        result = operate(this.op, this.num1, this.num2);
        this.display = String(result);

        this.equalsJustPressed = true;
        this.state = CALC_STATES.EQUALS_PRESSED;
        
    },

    btnBackspace() {
        if (this.zeroDiv) {
            this.btnC();
            this.enableKeyUponZeroDiv();
            this.zeroDiv = false;
            return;
        }

        if (this.opJustPressed) {
            return;
        }

        if (this.equalsJustPressed) {
            this.displayHistory = '';
            return;
        }

        this.removeDisplayDigit();
    },

    btnCE() {
        if (this.zeroDiv) {
            this.btnC();
            this.enableKeyUponZeroDiv();
            this.zeroDiv = false;
            return;
        }

        if (this.equalsJustPressed) {
            this.displayHistory = '';
        }
        this.display = '0';
    },

    btnC() {
        if (this.zeroDiv) {
            this.enableKeyUponZeroDiv();
            this.zeroDiv = false;
        }
        this.num1 = null;
        this.num2 = null;
        this.op = null;
        this.displayHistory = '';
        this.display = '0';
        this.state = null;
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

    const btnBackspace = document.querySelector('#keys-backspace');
    btnBackspace.addEventListener('click', () => calc.btnBackspace())

    const btnCE = document.querySelector('#keys-CE');
    btnCE.addEventListener('click', () => calc.btnCE())

    const btnC = document.querySelector('#keys-C');
    btnC.addEventListener('click', () => calc.btnC())
}


main();