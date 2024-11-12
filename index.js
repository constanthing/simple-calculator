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

function display() {
    let string = "";
    const bufferLength = buffer.length;

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
    // ??? what if its a double????
    // converting strings to integers 
    buffer[0] = parseInt(buffer[0]);
    buffer[1] = parseInt(buffer[1]);

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
        default: break;
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

numbers.forEach((nmb) => {
    // number pressed
    nmb.addEventListener("click", ()=>{
        if (number == null) {
            number = `${nmb.innerText}`;
        } else {
            number += nmb.innerText;
        }

        display()
    })
})

symbols.forEach((sym) => {
    sym.addEventListener("click", ()=>{
        if (sym.innerText == "C") {
            buffer.length = 0;
            number = null;
            symbol = null;
            display()
            return;
        }
        // symbol clicked

        if (number != null && symbol == null) {
            // if number is not empty then add it to the buffer
            pushToBuffer()
        }


        if (number != null && symbol != null) {
            performOperation()
        }

        if (number == null && sym != null) {
            // replace current symbol
            symbol = sym.innerText
        }

        // assign clicked symbol to variable symbol
        symbol = sym.innerText;

        display()
    })
})

document.querySelector("#equal").addEventListener("click", ()=>{
    if (symbol != null && number != null) {
        // perform operation
        performOperation()
        display()
    }
})