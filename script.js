const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let expression = "";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;


// ========================================
// BUTTON SOUND
// ========================================

let audioContext = null;

function playClickSound() {
    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        if (!audioContext) {
            audioContext = new AudioContext();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "square";

        oscillator.frequency.setValueAtTime(
            600,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            250,
            audioContext.currentTime + 0.06
        );

        gainNode.gain.setValueAtTime(
            0.12,
            audioContext.currentTime
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.06
        );

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.06
        );

    } catch (error) {

        // If sound fails, calculator still works
        console.log("Sound unavailable");
    }
}


// ========================================
// DISPLAY ANIMATION
// ========================================

function animateDisplay() {

    display.classList.remove("result-animation");

    void display.offsetWidth;

    display.classList.add("result-animation");
}


// ========================================
// BUTTONS
// ========================================

buttons.forEach((button) => {

    button.addEventListener("click", () => {

        // Sound cannot stop calculator functionality
        playClickSound();

        const value = button.textContent.trim();


        // ========================================
        // AC
        // ========================================

        if (value === "AC") {

            expression = "";
            firstNumber = null;
            operator = null;
            waitingForSecondNumber = false;

            display.value = "0";

            return;
        }


        // ========================================
        // PLUS / MINUS
        // ========================================

        if (value === "+/-") {

            if (expression !== "") {

                const number = parseFloat(expression);

                expression = String(number * -1);

                display.value = expression;
            }

            return;
        }


        // ========================================
        // PERCENTAGE
        // ========================================

        if (value === "%") {

            if (expression !== "") {

                const number = parseFloat(expression);

                expression = String(number / 100);

                display.value = expression;
            }

            return;
        }


        // ========================================
        // DECIMAL
        // ========================================

        if (value === ".") {

            expression += ".";

            display.value = expression;

            return;
        }


        // ========================================
        // OPERATOR
        // ========================================

        if (button.classList.contains("operator")) {

            if (expression === "") {
                return;
            }

            firstNumber = parseFloat(expression);

            operator = value;

            expression += " " + value + " ";

            display.value = expression;

            waitingForSecondNumber = true;

            return;
        }


        // ========================================
        // EQUAL
        // ========================================

        if (button.classList.contains("equal")) {

            if (
                firstNumber === null ||
                operator === null
            ) {
                return;
            }

            const parts = expression.trim().split(" ");

            const secondNumber =
                parseFloat(parts[2]);

            let result;


            if (operator === "+") {

                result =
                    firstNumber + secondNumber;

            } else if (
                operator === "−" ||
                operator === "-"
            ) {

                result =
                    firstNumber - secondNumber;

            } else if (
                operator === "×" ||
                operator === "x"
            ) {

                result =
                    firstNumber * secondNumber;

            } else if (
                operator === "÷" ||
                operator === "/"
            ) {

                if (secondNumber === 0) {

                    display.value = "Error";

                    expression = "";

                    firstNumber = null;

                    operator = null;

                    return;
                }

                result =
                    firstNumber / secondNumber;
            }


            // Show complete calculation
            display.value =
                expression + " = " + result;


            // Result animation
            animateDisplay();


            // Prepare next calculation
            expression = String(result);

            firstNumber = null;

            operator = null;

            waitingForSecondNumber = true;

            return;
        }


        // ========================================
        // NUMBERS
        // ========================================

        if (!isNaN(value)) {

            if (waitingForSecondNumber) {

                expression += value;

                waitingForSecondNumber = false;

            } else {

                expression += value;
            }

            display.value = expression;

            return;
        }

    });

});