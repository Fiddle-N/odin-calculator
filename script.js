

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

    _reset() {
        this.num1 = null;
        this.num2 = null;
        this.op = null;
        this.displayHistory = '';
        this.display = '0';
        this.state = null;
    },

    _zeroDivReset() {
        this._reset();
        this.enableKeyUponZeroDiv();
    },

    btnNum(event) {
        const numStr = event.target.textContent;

        if (this.state === CALC_STATES.ZERO_DIV) {
            this._zeroDivReset();
        }
        
        else if (this.state === CALC_STATES.OP_PRESSED) {
            this.display = '';

        }
        else if (this.state === CALC_STATES.EQUALS_PRESSED) {
            this._reset()

        }

        this.appendDisplayDigit(numStr);
        this.state = CALC_STATES.NUM_PRESSED;
    },

    btnOp(event) {
        const op = event.target.dataset.op;
        const opTxt = event.target.textContent;
    
        if (!(this.state === CALC_STATES.OP_PRESSED)) {
            if (this.num1 && (!this.state === CALC_STATES.EQUALS_PRESSED)) {
                this.btnEquals();
                if (this.state === CALC_STATES.ZERO_DIV) {
                    this.displayHistory = `${this.num1} ${OP_TO_OP_STR[this.op]} ${this.num2} ${opTxt}`;
                    return;
                } 
                
            }
            this.num1 = Number(this.display);
            this.num2 = null;
        }

        this.displayHistory = `${this.num1} ${opTxt}`;
        this.op = op;
        this.state = CALC_STATES.OP_PRESSED;
    },

    btnEquals() {
        if (this.state === CALC_STATES.ZERO_DIV) {
            this._zeroDivReset();
            return;
        }

        if (this.op === '/' && this.display === '0'){
            this.num2 = Number(this.display);
            this.display = 'Cannot divide by zero';
            this.disableKeyUponZeroDiv();
            this.state = CALC_STATES.ZERO_DIV;
            return;
        }

        if (!this.op){
            this.displayHistory = `${this.display} =`;
            this.display = String(this.display);
            this.state = CALC_STATES.EQUALS_PRESSED;
            return;
        }

        if (this.state === CALC_STATES.EQUALS_PRESSED) {
            this.num1 = Number(this.display);
        }
        else {
            this.num2 = Number(this.display);
        }
        this.displayHistory = `${this.num1} ${OP_TO_OP_STR[this.op]} ${this.num2} =`;
        result = operate(this.op, this.num1, this.num2);
        this.display = String(result);

        this.state = CALC_STATES.EQUALS_PRESSED;    
    },

    btnBackspace() {
        if (this.state === CALC_STATES.ZERO_DIV) {
            this._zeroDivReset();
        }

        else if (this.state === CALC_STATES.EQUALS_PRESSED) {
            this.displayHistory = '';
        }

        else if (!(this.state === CALC_STATES.OP_PRESSED)){
            this.removeDisplayDigit();
        }
    },

    btnCE() {
        if (this.state === CALC_STATES.ZERO_DIV) {
            this._zeroDivReset();
            return;
        }

        if (this.state === CALC_STATES.EQUALS_PRESSED) {
            this.displayHistory = '';
        }
        this.display = '0';
    },

    btnC() {
        if (this.state === CALC_STATES.ZERO_DIV) {
            this._zeroDivReset();
        }
        else {
            this._reset();
        }
    },

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