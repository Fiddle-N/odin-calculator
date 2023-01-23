

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


const calc = {
    num1: null,
    num2: null,
    op: null,
    opJustPressed: false,

    equals: false,
    equalsJustPressed: false,

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
        this.appendDisplay(numStr);
    },

    btnOp(event) {
        if (!this.num1) {
            this.num1 = Number(this.display);
            this.num2 = 0;

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
            this.num2 = 0;

            const op = event.target.dataset.op;
            const opTxt = event.target.textContent;

            this.op = op;
            this.opJustPressed = true;
            this.displayHistory = `${this.display} ${opTxt}`;

            this.equalsJustPressed = false;
        }
        else if (this.num1) {
            this.btnEquals();
            this.num1 = Number(this.display);
            this.num2 = 0;

            const op = event.target.dataset.op;
            const opTxt = event.target.textContent;

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
    },

    btnEquals() {

        if (this.num2 === null){
            this.displayHistory = `${this.display} =`;
            this.display = String(this.display);
            this.equalsJustPressed = true;
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