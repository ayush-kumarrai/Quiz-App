import { useState, useEffect } from 'react'

const Quiz = ({
  questions,
  currentQuestionIndex,
  selectedOption,
  onOptionSelect,
  onNext,
  onPrevious
}) => {
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    setTimeLeft(30)
  }, [currentQuestionIndex])

  useEffect(() => {
    if (timeLeft === 0) {
      onNext()
      return
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timerId)
  }, [timeLeft, onNext])

  if (questions.length === 0) {
    return (
      <div className="container">
        <div className="error">No questions available. Please try again later.</div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="container">
      <div className="progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="question-count">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="timer">
        Time left: <span className={timeLeft <= 10 ? 'timer-danger' : timeLeft <= 20 ? 'timer-warning' : ''}>
          {timeLeft}s
        </span>
      </div>

      <div className="question-text">
        {currentQuestion.question}
      </div>

      <div className="options-container">
        {currentQuestion.options.map((option, index) => (
          <div
            key={index}
            className={`option ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => onOptionSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>

      <div className="navigation">
        <button 
          className="btn-prev" 
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        {currentQuestionIndex === questions.length - 1 ? (
          <button 
            className="btn-submit"
            onClick={onNext}
            disabled={!selectedOption}
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            className="btn-next"
            onClick={onNext}
            disabled={!selectedOption}
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}

export default Quiz