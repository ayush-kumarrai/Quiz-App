const Results = ({ questions, selectedOptions, score, onRestart }) => {
  return (
    <div className="container">
      <div className="score-display">
        <div className="score-text">Your Score:</div>
        <div className="score-value">{score} / {questions.length}</div>
        <div className="score-text">
          {score === questions.length ? "Perfect! You're a genius!" :
           score >= questions.length * 0.7 ? "Great job!" :
           score >= questions.length * 0.5 ? "Good effort!" :
           "Keep practicing!"}
        </div>
      </div>

      <div className="results-list">
        <h2>Review Your Answers</h2>
        {questions.map((question, index) => {
          const isCorrect = selectedOptions[index] === question.correctAnswer
          return (
            <div key={index} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="result-question">
                {index + 1}. {question.question}
              </div>
              <div className="result-answer">
                <span className="result-label">Your answer:</span>
                <span className={isCorrect ? 'correct-answer' : 'incorrect-answer'}>
                  {selectedOptions[index] || "Not answered"}
                </span>
              </div>
              {!isCorrect && (
                <div className="result-answer">
                  <span className="result-label">Correct answer:</span>
                  <span className="correct-answer">{question.correctAnswer}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button className="btn-restart" onClick={onRestart}>
        Restart Quiz
      </button>
    </div>
  )
}

export default Results