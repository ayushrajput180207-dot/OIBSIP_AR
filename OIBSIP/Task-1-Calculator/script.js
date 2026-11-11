var display = document.getElementById("display");

var firstNumber = "";
var operator = "";
var waitingForSecond = false;

function pressNumber(num) {
  if (waitingForSecond || display.value === "Error") {
    display.value = "0";
    waitingForSecond = false;
  }

  if (num === "." && display.value.includes(".")) {
    return;
  }

  if (display.value === "0" && num !== ".") {
    display.value = num;
  } else {
    display.value = display.value + num;
  }
}

function pressOperator(op) {
  if (display.value === "Error") {
    return;
  }

  if (operator !== "" && !waitingForSecond) {
    calculate();
  }

  firstNumber = display.value;
  operator = op;
  waitingForSecond = true;
}

function calculate() {
  if (operator === "" || waitingForSecond) {
    return;
  }

  var num1 = parseFloat(firstNumber);
  var num2 = parseFloat(display.value);
  var result = 0;

  if (operator === "+") {
    result = num1 + num2;
  } else if (operator === "-") {
    result = num1 - num2;
  } else if (operator === "*") {
    result = num1 * num2;
  } else if (operator === "/") {
    if (num2 === 0) {
      display.value = "Error";
      firstNumber = "";
      operator = "";
      waitingForSecond = true;
      return;
    }
    result = num1 / num2;
  }

  result = Math.round(result * 1000000000) / 1000000000;

  display.value = result;

  firstNumber = "";
  operator = "";
  waitingForSecond = true;
}

function clearDisplay() {
  display.value = "0";
  firstNumber = "";
  operator = "";
  waitingForSecond = false;
}
