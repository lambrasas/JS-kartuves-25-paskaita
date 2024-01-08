const words = [
    "apple",
    "banana",
    "grape",
    "melon",
    "peach",
    "berry",
    "lemon",
    "mango",
    "kiwi",
    "plum",
    "cherry",
    "pear",
    "date",
    "fig",
    "olive",
    "orange",
    "papaya",
    "avocado"
];

let selectedWord;
let guessedLetters;
const letterDiv=document.getElementById("wordDisplay")
const guessedLettersSpan=document.getElementById("guessedLettersSpan")
const letterInput = document.getElementById("letterInput")
const guessCounter=document.getElementById("guessesLeft")

async function getRandomWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const words = await response.json();
        return words[0]; // Assuming the API returns an array of words
    } catch (error) {
        console.error("Failed to fetch random word:", error);
    }
}

// Usage
function initializeGame()
{
    letterDiv.innerHTML=""
    guessedLettersSpan.textContent=""
    guessCounter.textContent=20
    guessedLetters=[];

    getRandomWord().then(word => {
        selectedWord = word
        // console.log(selectedWord)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! YOU NEED THIS TO NOT DIE
    
        for(let i=0;i<selectedWord.length;i++){
            let letterSpace=document.createElement("span")
            letterSpace.setAttribute("id",`${i}`)
            letterSpace.textContent = '_ ';
            letterDiv.appendChild(letterSpace)
    
        }
    });
}

window.onload=initializeGame

function submitGuess()
{
    //TODO check input
    if(!letterInput.value.match(/[a-z]/i))
    {
        alert("Letters only!")
        letterInput.value=""
        return
    }

    let usersLetter=letterInput.value.toLowerCase()

    if(!guessedLetters.includes(usersLetter))
    {
        guessedLetters.push(usersLetter)
        updateAllGuessedLetters(usersLetter)

        if(selectedWord.includes(usersLetter))
        {
         // searching for letter locations
            let indexes = locationsOfSetLetter(usersLetter);
            revealLetters(indexes, usersLetter)
        }else{
            updateGuessCounter()
        }
    }
    else{
       alert(`${usersLetter} was already guessed`)
    }

    letterInput.value=""
}

function locationsOfSetLetter(letter)
{
    let indexes=[];
    for(let i=0; i<selectedWord.length;i++)
    {
        if(letter==selectedWord[i]){
            indexes.push(i)
        }
    }

    return indexes
}

function revealLetters(indexes,usersLetter)
{
    indexes.forEach((index) =>
    {
        //get span by index
        let span = document.getElementById(`${index}`)
        //update it's contents
        span.textContent=usersLetter
        
    })

    let currentword = []
    for (let i = 0; i < selectedWord.length; i++)
    {
        currentword.push(document.getElementById(`${i}`).textContent);
    }

    if(currentword.join("") == selectedWord)
    {
        alert("You won!")
        return
    }
}

function updateAllGuessedLetters(letter)
{   
    //build new string
    let spanValue = guessedLettersSpan.textContent
    spanValue = spanValue + ` ${letter}`;
    guessedLettersSpan.textContent = spanValue;
}
function updateGuessCounter(){
    let guessValue=guessCounter.textContent
    guessValue=guessValue-1
    if(guessValue==0){
        alert(`No more guesses left :( \nThe word was: ${selectedWord}`)
        initializeGame()
        return
    }
    guessCounter.textContent=guessValue
}