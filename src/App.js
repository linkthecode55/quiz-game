import React from 'react'
import Start from './components/Start'
import Background from "./components/Background"
import Quiz from './components/Quiz'
import Button from './components/Button'
import {nanoid} from "nanoid"
import arrayShuffle from 'array-shuffle';
import Confetti from 'react-confetti'

export default function App() {

    const [isStarted, setIsStarted] = React.useState(false)
    const [gameEnded, setGameEnded] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [number, setNumber] = React.useState(0)
    const [category, setCategory] = React.useState("any")
    const [difficulty, setDifficulty] = React.useState("any")
    const [numberCorrect, setNumberCorrect] = React.useState(0)
    localStorage.setItem("correctAnswersNum", "null")

    function fetchNumberQuestions(event) {
        const {value} = event.target
        if ([value] == "")
        {
            setNumber(0)
        }
        else
        {
            setNumber([value])
        }
        
    }

    function fetchCategory(event) {
        const {value} = event.target
        if ([value] == "any")
        {
            setCategory("any")
        }
        else
        {
            setCategory([value])
        }
        
    }

    function fetchDifficulty(event) {
        const {value} = event.target
        if ([value] == "any")
        {
            setDifficulty("any")
        }
        else
        {
            setDifficulty([value])
        }
        
    }

    function createNewGame() {
        console.log("Creating new game. . .")
        if (number != 0)
        {
            setIsStarted(oldIsStarted => oldIsStarted = true) 
        }
          
        
    }

    function startNewGame() {
        console.log("Starting new game. . .")
        setIsStarted(oldIsStarted => oldIsStarted = !oldIsStarted)
        setGameEnded(oldGameEnded => oldGameEnded = !oldGameEnded)
        setNumber(0)  
        setCategory("any")
        setDifficulty("any")
        localStorage.setItem("correctAnswersNum", "null")
        setNumberCorrect(0)
    }

    function showResults() {
        console.log("Showing results. . .")
        setGameEnded(oldVal => oldVal = true)
    }

    const [questions, setQuestions] = React.useState([{
        id: null,
        question: "", 
        correct_answer: "", 
        answers: [], 
        category: "", 
        difficulty: "", 
        type: ""
    }])

    React.useEffect(() => {
        setMessage(oldMessage => oldMessage = localStorage.getItem("correctAnswers"))
        setNumberCorrect(oldNumberCorrect =>  oldNumberCorrect = localStorage.getItem("correctAnswersNum"))
    }, [gameEnded])

    React.useEffect(() => {
        
            //  Getting API data depending on category and difficulty set
            var api = ""

            if (category === "any")
            {
                difficulty === "any" ? api = "https://opentdb.com/api.php?amount=" + number : api = "https://opentdb.com/api.php?amount=" + number + "&difficulty=" + difficulty
                  
            }
            else
            {

                difficulty === "any" ? api = "https://opentdb.com/api.php?amount=" + number + "&category=" + category : api = "https://opentdb.com/api.php?amount=" + number + "&category=" + category + "&difficulty=" + difficulty
               
            }

            fetch(api)
                .then(res => res.json())
                .then(data => setQuestions(data.results.map(item => ({
                    key: nanoid(),
                    question: item.question,
                    correct_answer: item.correct_answer,
                    category: item.category,
                    difficulty: item.difficulty,
                    type: item.type,
                    answers: arrayShuffle(item.incorrect_answers.concat(item.correct_answer)),   
                }))))
    }, [isStarted])

    console.log (numberCorrect)
    console.log (number)
    return (
        <main>     
            {String(numberCorrect).valueOf() === String(number).valueOf() && <Confetti />}
            <Background />
            {isStarted == false && <Start handleClick= {createNewGame} handleChangeNumber={fetchNumberQuestions} handleChangeCategory={fetchCategory} handleChangeDifficulty={fetchDifficulty} numQuestions={number}/>}

            {isStarted == true && <Quiz Data={questions} ended={gameEnded} numQuestions={number}/>}
            {isStarted == true && <Button ended= {gameEnded} startNewGame = {startNewGame} showResults = {showResults} />}

            {gameEnded == true && <div align="center">
               <h3 className='correct-answers'>{message}</h3>
               {String(numberCorrect).valueOf() === String(number).valueOf() && <h3 className='correct-answers'>Congratulations! You answered all the questions correctly!!</h3>}
            </div>}
        </main>
    )
}