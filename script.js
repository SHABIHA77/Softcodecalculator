const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let expression = "";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

buttons.forEach((button) => {

    button.addEventListener("click", () => {

        const value = button.textContent.trim();

        // =========================
        // NUMBER
        // =========================
        if (
            !button.classList.contains("operator") &&
            !button.classList.contains("equal") &&
            !button.classList.contains("function") &&
            value !== "."
        ) {

            if (waitingForSecondNumber) {
                expression += value;
                waitingForSecondNumber = false;
            } else {
                expression += value;
            }

            display.value = expression;
            return;
        }

        // =========================
        // DECIMAL
        // =========================
        if (value === ".") {

            expression += ".";

            display.value = expression;

            return;
        }

        // =========================
        // OPERATOR
        // =========================
        if (button.classList.contains("operator")) {

            firstNumber = parseFloat(expression);

            operator = value;

            expression += " " + value + " ";

            display.value = expression;

            waitingForSecondNumber = true;

            return;
        }

        // =========================
        // EQUAL
        // =========================
        if (button.classList.contains("equal")) {

            const parts = expression.trim().split(" ");

            const secondNumber = parseFloat(parts[2]);

            let result;

            if (operator === "+") {
                result = firstNumber + secondNumber;
            }

            else if (operator === "−") {
                result = firstNumber - secondNumber;
            }

            else if (operator === "×") {
                result = firstNumber * secondNumber;
            }

            else if (operator === "÷") {

                if (secondNumber === 0) {
                    display.value = "Error";
                    return;
                }

                result = firstNumber / secondNumber;
            }

            // COMPLETE EXPRESSION + RESULT
            display.value = expression + " = " + result;

            // Prepare for next calculation
            expression = String(result);
            firstNumber = null;
            operator = null;
            waitingForSecondNumber = true;

            return;
        }

        // =========================
        // AC
        // =========================
        if (value === "AC") {

            expression = "";
            firstNumber = null;
            operator = null;
            waitingForSecondNumber = false;

            display.value = "0";

            return;
        }

        // =========================
        // PLUS / MINUS
        // =========================
        if (value === "+/-") {

            if (expression !== "") {

                const number = parseFloat(expression);

                expression = String(number * -1);

                display.value = expression;
            }

            return;
        }

        // =========================
        // PERCENTAGE
        // =========================
        if (value === "%") {

            if (expression !== "") {

                const number = parseFloat(expression);

                expression = String(number / 100);

                display.value = expression;
            }

            return;
        }

    });

});