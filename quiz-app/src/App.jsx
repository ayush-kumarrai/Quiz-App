// App.jsx
import { useState, useEffect } from 'react'
import Quiz from './components/Quiz'
import Results from './components/Results'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&type=multiple')
      const data = await response.json()
      
      if (data.response_code === 0) {
        const formattedQuestions = data.results.map((question, index) => ({
          id: index,
          question: decodeHTML(question.question),
          options: [...question.incorrect_answers.map(a => decodeHTML(a)), 
                   decodeHTML(question.correct_answer)].sort(() => Math.random() - 0.5),
          correctAnswer: decodeHTML(question.correct_answer),
          difficulty: question.difficulty
        }))
        setQuestions(formattedQuestions)
      } else {
        setError('Failed to load questions. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }

  const handleOptionSelect = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: option
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      calculateScore()
      setQuizCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScore = () => {
    let correctCount = 0
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctAnswer) {
        correctCount++
      }
    })
    setScore(correctCount)
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedOptions({})
    setScore(0)
    setQuizCompleted(false)
    fetchQuestions()
  }

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">Loading questions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="container">
          <div className="error">{error}</div>
          <button className="btn-restart" onClick={fetchQuestions}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {!quizCompleted ? (
        <Quiz
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          selectedOption={selectedOptions[currentQuestionIndex]}
          onOptionSelect={handleOptionSelect}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ) : (
        <Results
          questions={questions}
          selectedOptions={selectedOptions}
          score={score}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}

export default App