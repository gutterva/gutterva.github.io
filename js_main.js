document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [[]];
    
    let availableSpace = 1;

    let word = "dhruva";

    let guessedWordCount = 0;
    
    const keys = document.querySelectorAll('.keyboard-row button');


    function getTileColor(letter, index){
        const isCorrectLetter = word.includes(letter)
        if (!isCorrectLetter){
            return "rgb(146, 72, 122)"
        }

        const letterInThatPosition = word.charAt(index)
        const isCorrectPosition = letter === letterInThatPosition

        if(isCorrectPosition){
            return "rgb(218, 73, 141)"
        }
        return "rgb(250, 198, 122)"

        

    }


    function getCurrentWordArr(){
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords-1];
    }

    function updateGuessedWords(letter){
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 6) {
            currentWordArr.push(letter);

            let availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1
            availableSpaceEl.textContent = letter 
        }

    }
    
    function handleSubmitWord(){

        const currentWordArr = getCurrentWordArr()
        if (currentWordArr.length !== 6){
            window.alert("word must be 6 letters");
        }

        const currentWord = currentWordArr.join('');

        const firstLetterId = guessedWordCount * 6 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(()=> {
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId)
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;

            }, interval * index)
        });

        guessedWordCount += 1;
   
        if (currentWord == word) {
            window.alert("Congrats");
        }

        if (guessedWords.length == 6){
            window.alert("try again")
        }

        guessedWords.push([])
        

    }

    function createSquares(){
        const gameBoard = document.getElementById("board")

        for (let index = 0; index < 36; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
            
        }
    }

    function handleDeleteLetter(){
        const currentWordArr = getCurrentWordArr()
        if (currentWordArr.length === 0) return;
        const removedLetter = currentWordArr.pop()
        guessedWords[guessedWords.length - 1] = currentWordArr
        const lastLetterEl = document.getElementById(String(availableSpace-1))
        lastLetterEl.textContent = ''
        availableSpace = availableSpace - 1

    }
         

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({target}) => {
            const letter = target.getAttribute("data-key");

            if (letter == 'enter'){
                handleSubmitWord()
                return;
            }

            if(letter == "del"){
                handleDeleteLetter()
                return;
            }

            updateGuessedWords(letter);
        };

        
    }
        document.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();

        if (key === "enter") {
            handleSubmitWord();
            return;
        }

        if (key === "backspace") {
            handleDeleteLetter();
            return;
        }

        if (key.length === 1 && key >= "a" && key <= "z") {
            updateGuessedWords(key);
        }
    });




});
