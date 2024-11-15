const output = document.querySelector("#output p");
const history = document.querySelector("#history-list");


const numbers = document.querySelectorAll(".nmb");
let buffer = [];
let number = null;
let result = 0;
const symbols = document.querySelectorAll(".sym");
let symbol = null;

function pushToBuffer() {
    buffer.push(number)
    number = null;
}

function addHistory() {
    if (history.children.length == 1) {
        history.children[0].style.display = "none";
    }
    const item = document.createElement("li");
    item.innerText = `${buffer[0]} ${symbol} ${buffer[1]} = ${result}`;
    history.insertBefore(item, history.children[0])
}

function updateDisplay() {
    if (symbol == null) {
        // if sym null then no number has been pushed to buffer yet
        // so only check number
        if (number == null) {
            output.innerText = "0";
        } else {
            output.innerText = number;
        }
    } else {
        // symbol not null 
        if (number == null) {
            output.innerText = buffer[0] + " " + symbol;
        } else {
            output.innerText = buffer[0] + " " + symbol + " " + number;
        }
    }
}

function performCalculation() {
    // converting strings to their numbers format 
    buffer[0] = Number(buffer[0]);
    buffer[1] = Number(buffer[1]);

    switch (symbol) {
        case "+":
            result = buffer[0] + buffer[1];
            break;
        case "-":
            result = buffer[0] - buffer[1];
            break;
        case "/":
            result = buffer[0] / buffer[1];
            break;
        case "*":
            result = buffer[0] * buffer[1];
            break;
        case "%":
            result = buffer[0] % buffer[1];
            break;
        default:
            result = 0;
            break;
    }

    if (!Number.isInteger(result)) {
        result = parseFloat(result.toFixed(2))
    }

    // updating current number to be the number
    number = result;
    addHistory()
}

function performOperation() {
    // perform operation on current numbers (2) and symbol
    // add current number to buffer
    pushToBuffer()
    performCalculation()
    buffer.length = 0;
    pushToBuffer()
}

function numberClicked(nmb) {
    if (number == null) {
        number = `${nmb}`;
    } else {
        number += nmb;
    }

    updateDisplay()
}

numbers.forEach((nmb) => {
    // number pressed
    nmb.addEventListener("click", ()=>{
        numberClicked(nmb.innerText)
    })
})

function symbolClicked(sym) {
    // symbol clicked

    // clear clicked
    if (sym == "C") {
        buffer.length = 0;
        number = null;
        symbol = null;
        updateDisplay()
        return;
    }

    // since by default number is null 
    // when they press the symbol
    // it pushes number to the buffer
    // so we have to make it 0 instead of having null pushed
    if (number == null && buffer.length == 0) {
        number = 0;
        pushToBuffer()
    }

    // pushing number to buffer
    if (number != null && symbol == null) {
        pushToBuffer()
    }

    // number ready to be pushed into buffer
    // buffer has a number already
    // perform operation on buffer number and queued number
    if (number != null && symbol != null) {
        performOperation()
    }

    // symbol not being null means a number is in the buffer
    // and number is null 
    // so replace current sybmol with new one
    if (number == null && sym != null) {
        symbol = sym;
    }

    // assign clicked symbol to variable symbol
    symbol = sym;

    updateDisplay()
}

symbols.forEach((sym) => {
    sym.addEventListener("click", ()=>{
        symbolClicked(sym.innerText)
    })
})

document.querySelector("#inverse").addEventListener("click", ()=>{
    if (number != null) {
        if (number.charAt(0) == "-") {
            number = number.replace("-", "")
        } else {
            number = "-" + number
        }
    }
    updateDisplay()
})

function rootClicked() {
    if (number != null) {
        number = Math.sqrt(Number(number));
        if (!Number(number).isInteger) {
            number = number.toFixed(2);
        }
        number += "";
        updateDisplay()
    }
}
document.querySelector("#root").addEventListener("click", ()=>{
    rootClicked()
})


function dotClicked() {
    if (number == null) {
        number = "0.";
    } else {
        if (number.includes(".")) {
            // do nothing
        } else {
            number += ".";
        }
    } 

    updateDisplay()
}
document.querySelector("#dot").addEventListener("click", ()=>{
    dotClicked()
})

function equalClicked() {
    if (symbol != null && number != null) {
        // perform operation
        performOperation()
        updateDisplay()
    }
}
document.querySelector("#equal").addEventListener("click", ()=>{
    equalClicked()
})

// sets are faster than array.includes(n) --- O(1) vs O(n)
const symbs = new Set(['*', '/', '%', '-', '+', 'C']);
const nmbs = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);

window.addEventListener("keydown", (e)=>{
    // check for key value number instead of string ? maybe 
    switch (e.key) {
        case "Enter":
            equalClicked()
            return;
        case ".":
            dotClicked()
            return;
        case "r": case "R":
            rootClicked()
            return;
    }

    if (nmbs.has(e.key)) {
        numberClicked(e.key)
        return;
    }

    if (symbs.has(e.key)) {
        symbolClicked(e.key)
    }
})