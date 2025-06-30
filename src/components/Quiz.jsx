import React, { useState } from 'react'
import { CheckCircle, XCircle, SkipForward, Info } from 'lucide-react'

const Quiz = ({ questions, onComplete }) => {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [finished, setFinished] = useState(false)

  const handleAnswer = (option) => {
    const correct = questions[current].correct === option
    setAnswers([...answers, { selected: option, correct }])
    setFeedback(correct ? 'correct' : 'incorrect')
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      setFeedback(null)
      if (current + 1 < questions.length) {
        setCurrent(current + 1)
      } else {
        setFinished(true)
        if (onComplete) onComplete(answers)
      }
    }, 1000)
  }

  const handleSkip = () => {
    setAnswers([...answers, { selected: null, correct: false, skipped: true }])
    if (current + 1 < questions.length) {
      setCurrent(current + 1)
    } else {
      setFinished(true)
      if (onComplete) onComplete(answers)
    }
  }

  if (finished) {
    const correctCount = answers.filter(a => a.correct).length
    return (
      <div className="card text-center">
        <CheckCircle className="w-8 h-8 text-success-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold mb-2">Quiz Complete!</h3>
        <p className="mb-2">You answered {correctCount} out of {questions.length} correctly.</p>
        <div className="flex flex-col items-center space-y-1 mb-2">
          {answers.map((a, i) => (
            <div key={i} className="flex items-center space-x-2 text-sm">
              <span>Q{i+1}:</span>
              {a.skipped ? (
                <span className="text-warning-600 flex items-center"><SkipForward className="w-4 h-4 mr-1" />Skipped</span>
              ) : a.correct ? (
                <span className="text-success-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1" />Correct</span>
              ) : (
                <span className="text-error-600 flex items-center"><XCircle className="w-4 h-4 mr-1" />Incorrect</span>
              )}
            </div>
          ))}
        </div>
        <button className="btn-primary mt-2" onClick={() => window.location.reload()}>Retake Quiz</button>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quiz Question {current + 1} / {questions.length}</h3>
        <button className="flex items-center space-x-1 text-warning-600 hover:underline text-xs" onClick={handleSkip} title="Skip this question">
          <SkipForward className="w-4 h-4" />
          <span>Skip</span>
        </button>
      </div>
      <div className="mb-4">
        <p className="font-medium mb-2">{q.question}</p>
        <div className="grid gap-2">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              className={`w-full px-4 py-2 rounded-lg border text-left transition-colors duration-200 ${showFeedback && q.correct === opt ? 'bg-success-100 border-success-400' : 'bg-secondary-50 border-secondary-200 hover:bg-primary-50'} ${showFeedback && feedback === 'incorrect' && opt === q.options.find(o => o === q.selected) ? 'bg-error-100 border-error-400' : ''}`}
              onClick={() => !showFeedback && handleAnswer(opt)}
              disabled={showFeedback}
              title={opt}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {showFeedback && (
        <div className="flex items-center space-x-2 mt-2">
          {feedback === 'correct' ? (
            <span className="text-success-600 flex items-center"><CheckCircle className="w-5 h-5 mr-1" />Correct!</span>
          ) : (
            <span className="text-error-600 flex items-center"><XCircle className="w-5 h-5 mr-1" />Incorrect</span>
          )}
        </div>
      )}
      <div className="mt-4 text-xs text-secondary-500 flex items-center space-x-1">
        <Info className="w-4 h-4" title="Tip: You can skip questions if unsure." />
        <span>Tip: You can skip questions if unsure.</span>
      </div>
    </div>
  )
}

export default Quiz 