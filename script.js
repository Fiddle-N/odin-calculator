"use strict";


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
};

const KB_KEY_TO_CALC_KEY = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '.': '.',
    '=': '=',
    'Enter': '=',
    'Backspace': '⌫',
    'Delete': 'CE',
    'Escape': 'C',
}

function operate(op, num1, num2) {
    return OPERATOR_FNS[op](num1, num2);
}

const CALC_STATES = {
    NUM_PRESSED: 0,
    DECIMAL_PRESSED: 1,
    OP_PRESSED: 2,
    EQUALS_PRESSED: 3,
    ZERO_DIV: 4,
};


const calcUIUpdate = {
    _display: document.querySelector('.display'),
    _displayHistory: document.querySelector('.displayHistory'),
    _zeroDivDisableKeys: document.querySelectorAll('.keys-disableOnZeroDivision'),

    get display() {
        return this._display.textContent;
    },

    set display(txt) {
        this._display.textContent = txt;
    },

    get displayHistory() {
        return this._displayHistory.textContent;
    },

    set displayHistory(txt) {
        this._displayHistory.textContent = txt;
    },

    disableKeyUponZeroDiv() {
        for (const key of this._zeroDivDisableKeys) {
            key.disabled = true;
        }
    },

    enableKeyUponZeroDiv() {
        for (const key of this._zeroDivDisableKeys) {
            key.disabled = false;
        }
    },

};

const calc = {
    num1: null,
    num2: null,
    op: null,
    state: null,

    calcUIUpdate,


    get display() {
        return this.calcUIUpdate.display;
    },

    set display(txt) {
        this.calcUIUpdate.display = txt;
    },

    get displayHistory() {
        return this.calcUIUpdate.displayHistory;
    },

    set displayHistory(txt) {
        this.calcUIUpdate.displayHistory = txt;
    },

    _appendDisplayDigit(digit) {
        if (this.display === '0') {
            this.display = digit;
        }
        else {
            this.display += digit;
        }
    },

    _removeDisplayDigit() {
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
        this.calcUIUpdate.enableKeyUponZeroDiv();
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

        this._appendDisplayDigit(numStr);
        this.state = CALC_STATES.NUM_PRESSED;
    },

    btnOp(event) {
        const op = event.target.dataset.symbol;
        const opTxt = OP_TO_OP_STR[op];

    
        if (!(this.state === CALC_STATES.OP_PRESSED)) {
            if (this.num1 && !(this.state === CALC_STATES.EQUALS_PRESSED)) {
                this.btnEquals(null);
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

    btnDecimalPoint(_) {
        if ([null, CALC_STATES.OP_PRESSED, CALC_STATES.EQUALS_PRESSED].includes(this.state)) {
            this.display = '0.';
        }
        else if (this.state === CALC_STATES.NUM_PRESSED && !(this.display.includes('.'))) {
            this.display += '.';
        }
        this.state = CALC_STATES.DECIMAL_PRESSED;
    },

    btnEquals(_) {
        if (this.state === CALC_STATES.ZERO_DIV) {
            this._zeroDivReset();
            return;
        }

        if (this.op === '/' && this.display === '0'){
            this.num2 = Number(this.display);
            this.display = 'Cannot divide by zero';
            this.calcUIUpdate.disableKeyUponZeroDiv();
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
        const result = operate(this.op, this.num1, this.num2);
        this.display = String(result);

        this.state = CALC_STATES.EQUALS_PRESSED;    
    },

    btnBackspace(_) {
        if (this.state === CALC_STATES.ZERO_DIV) {
            this._zeroDivReset();
        }

        else if (this.state === CALC_STATES.EQUALS_PRESSED) {
            this.displayHistory = '';
        }

        else if (!(this.state === CALC_STATES.OP_PRESSED)){
            this._removeDisplayDigit();
        }
    },

    btnCE(_) {
        if (this.state === CALC_STATES.ZERO_DIV) {
            this._zeroDivReset();
            return;
        }

        if (this.state === CALC_STATES.EQUALS_PRESSED) {
            this.displayHistory = '';
        }
        this.display = '0';
    },

    btnC(_) {
        if (this.state === CALC_STATES.ZERO_DIV) {
            this._zeroDivReset();
        }
        else {
            this._reset();
        }
    },

};

function setKeyTxt() {
    const keys = document.querySelectorAll('.keys-key');
    for (const key of keys) {
        const keySymbol = key.dataset.symbol;
        const txt = (keySymbol in OP_TO_OP_STR) ? OP_TO_OP_STR[keySymbol] : keySymbol;
        key.textContent = txt;
    }
}

function setKeyEventListeners() {
    const selectorEventListeners = {
        '.keys-digit': 'btnNum',
        '.keys-decimalPoint': 'btnDecimalPoint',
        '.keys-operator': 'btnOp',
        '.keys-equals': 'btnEquals',
        '#keys-backspace': 'btnBackspace',
        '#keys-CE': 'btnCE',
        '#keys-C': 'btnC',
    }

    for (const selector in selectorEventListeners) {
        const eventListener = selectorEventListeners[selector];
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
            element.addEventListener('click', (event) => calc[eventListener](event));
        }
    }   
}


function typingEventListener(event) {
    const key = document.querySelector(
        `.keys-key[data-symbol="${KB_KEY_TO_CALC_KEY[event.key]}"]`
    );
    if (key === null) {
        return;
    }
    key.click();
}


function setTypingEventListener() {
    window.addEventListener('keydown', typingEventListener);
}


function main() {
    setKeyTxt();
    setKeyEventListeners();
    setTypingEventListener();
}


main();