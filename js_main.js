document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [[]];
    let availableSpace = 1;
    let word = "choose"; // correct word
    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    const totalRows = 6;   
    const kittySize = 80;  

    const cursorKitty = document.createElement("img");
    cursorKitty.src = "kitty_yap.gif";
    cursorKitty.id = "cursor-kitty";
    cursorKitty.style.position = "absolute";
    cursorKitty.style.width = `${kittySize}px`;
    cursorKitty.style.height = `${kittySize}px`;
    cursorKitty.style.transition = "top 0.3s, left 0.3s";
    document.body.appendChild(cursorKitty);

    cursorKitty.classList.add("animate__animated", "animate__bounce", "animate__infinite");

    function updateKittyPosition() {
        const squareIndex = guessedWordCount * 6;
        const squareEl = document.getElementById(String(squareIndex + 1));
        if (!squareEl) return;

        const rect = squareEl.getBoundingClientRect();
        const top = rect.top + (rect.height - kittySize) / 2;
        const left = rect.left - kittySize - 5;

        cursorKitty.style.top = `${top}px`;
        cursorKitty.style.left = `${left}px`;
    }

    updateKittyPosition(); 

    const sleepingKitty = document.createElement("img");
    sleepingKitty.src = "kitty_eepy.gif";
    sleepingKitty.id = "sleeping-kitty";
    sleepingKitty.style.position = "absolute";
    sleepingKitty.style.width = "200px";
    sleepingKitty.style.height = "200px";
    sleepingKitty.style.cursor = "pointer";
    document.body.appendChild(sleepingKitty);

    function updateSleepingKittyPosition() {
        const firstRow = document.querySelector(".keyboard-row");
        if (!firstRow) return;

        const rect = firstRow.getBoundingClientRect();
        const top = rect.top - 90; 
        const left = rect.left - 320; 

        sleepingKitty.style.top = `${top}px`;
        sleepingKitty.style.left = `${left}px`;
    }

    updateSleepingKittyPosition();
    window.addEventListener("resize", updateSleepingKittyPosition);

    sleepingKitty.addEventListener("click", () => {
        for (let i = 1; i <= 36; i++) {
            const square = document.getElementById(String(i));
            square.textContent = "";
            square.style.backgroundColor = "";
            square.style.borderColor = "white";
            square.classList.remove("animate__flipInX");
        }
        guessedWords = [[]];
        availableSpace = 1;
        guessedWordCount = 0;
        updateKittyPosition();
    });

    /* ----------------------------------------------------------
       FIXED WORDLE-STYLE LOGIC (GREEN / YELLOW / GREY)
    ---------------------------------------------------------- */
    function evaluateGuessRow(guess, word) {
        const result = Array(guess.length).fill("grey");
        const remaining = {};

        for (const letter of word) {
            remaining[letter] = (remaining[letter] || 0) + 1;
        }

        // Step 1: Mark GREENS
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === word[i]) {
                result[i] = "green";
                remaining[guess[i]]--;
            }
        }

        // Step 2: Mark YELLOWS
        for (let i = 0; i < guess.length; i++) {
            if (result[i] === "green") continue;

            const letter = guess[i];
            if (remaining[letter] > 0) {
                result[i] = "yellow";
                remaining[letter]--;
            }
        }

        return result;
    }

    function showCustomAlert(message) {
        const alertBox = document.getElementById("custom-alert");
        const alertMessage = document.getElementById("alert-message");
        const okButton = document.getElementById("alert-ok");

        alertMessage.textContent = message;
        alertBox.classList.remove("hidden");

        okButton.onclick = () => {
            alertBox.classList.add("hidden");
        };
    }

    function getCurrentWordArr() {
        return guessedWords[guessedWords.length - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr && currentWordArr.length < 6) {
            currentWordArr.push(letter);
            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpaceEl.textContent = letter;
            availableSpace += 1;
        }
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr.length !== 6) {
            const lengthPopup = document.getElementById("length-popup");
            const lengthOk = document.getElementById("length-ok");
            lengthPopup.style.display = "flex";
            lengthOk.onclick = () => {
                lengthPopup.style.display = "none";
            };
            return;
        }

        const currentWord = currentWordArr.join("");
        const firstLetterId = guessedWordCount * 6 + 1;
        const interval = 200;

        /* Use the new row evaluation */
        const colors = evaluateGuessRow(currentWordArr, word);

        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);

                const color =
                    colors[index] === "green"  ? "rgb(218, 73, 141)" :
                    colors[index] === "yellow" ? "rgb(250, 198, 122)" :
                                                 "rgb(146, 72, 122)";

                letterEl.classList.add("animate__flipInX");
                letterEl.style.backgroundColor = color;
                letterEl.style.borderColor = color;
            }, interval * index);
        });

        const isCorrect = currentWord === word;
        guessedWordCount++;

        if (guessedWordCount < totalRows) {
            updateKittyPosition();
        }

        if (isCorrect) {
            const winPopup = document.getElementById("win-popup");
            const winOk = document.getElementById("win-ok");
            winPopup.style.display = "flex";
            winOk.onclick = () => {
                window.location.href = "index2.html";
            };
            return;
        } else {
            cursorKitty.classList.remove("animate__bounce");
            cursorKitty.classList.add("animate__shakeX");
            setTimeout(() => {
                cursorKitty.classList.remove("animate__shakeX");
                cursorKitty.classList.add("animate__bounce");
            }, 500);
        }

        if (guessedWords.length === totalRows) {
            const failPopup = document.getElementById("fail-popup");
            const failOk = document.getElementById("fail-ok");
            failPopup.style.display = "flex";
            failOk.onclick = () => {
                failPopup.style.display = "none";
            };
        }

        guessedWords.push([]);
    }

    function createSquares() {
        const gameBoard = document.getElementById("board");
        for (let index = 0; index < 36; index++) {
            const square = document.createElement("div");
            square.classList.add("square", "animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length === 0) return;

        currentWordArr.pop();
        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1));
        lastLetterEl.textContent = "";
        availableSpace -= 1;
    }

    keys.forEach(key => {
        key.onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");
            if (letter === "enter") return handleSubmitWord();
            if (letter === "del") return handleDeleteLetter();
            updateGuessedWords(letter);
        };
    });

    document.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        if (key === "enter") return handleSubmitWord();
        if (key === "backspace") return handleDeleteLetter();
        if (key.length === 1 && key >= "a" && key <= "z") updateGuessedWords(key);
    });

    const popup = document.getElementById("guide-popup");
    const popupOk = document.getElementById("popup-ok");

    popup.style.display = "flex"; 

    popupOk.addEventListener("click", () => {
        popup.style.display = "none";
    });
});
