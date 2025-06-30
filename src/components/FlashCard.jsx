import React, { useState } from 'react'
import { Star, StarOff, RotateCcw } from 'lucide-react'

const confidenceLevels = [
  { label: 'Low', color: 'bg-error-100 text-error-700' },
  { label: 'Medium', color: 'bg-warning-100 text-warning-700' },
  { label: 'High', color: 'bg-success-100 text-success-700' },
]

const FlashCard = ({ front, back, onFavorite, isFavorite, onConfidence, cardIndex, totalCards }) => {
  const [flipped, setFlipped] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)
  const [confidence, setConfidence] = useState(null)

  const handleFlip = () => {
    setFlipped(!flipped)
    setShowPrompt(false)
  }

  const handleConfidence = (level) => {
    setConfidence(level)
    if (onConfidence) onConfidence(level)
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        className={`card cursor-pointer select-none transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}
        style={{ minHeight: 200 }}
        onClick={handleFlip}
        tabIndex={0}
        aria-label={flipped ? 'Show front' : 'Show back'}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleFlip()}
      >
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${flipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-lg font-semibold mb-2">{front}</h3>
          {showPrompt && (
            <div className="mt-4 text-sm text-secondary-500 animate-pulse">
              Tap to flip
            </div>
          )}
        </div>
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <h3 className="text-lg font-semibold mb-2">{back}</h3>
          <div className="mt-4 flex space-x-2">
            {confidenceLevels.map((level, idx) => (
              <button
                key={level.label}
                className={`px-3 py-1 rounded-lg text-xs font-medium border ${level.color} ${confidence === level.label ? 'ring-2 ring-primary-400' : ''}`}
                onClick={e => { e.stopPropagation(); handleConfidence(level.label) }}
                title={`Mark as ${level.label} confidence`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        className="absolute top-3 right-3 p-2 rounded-full bg-white shadow hover:bg-primary-100 transition-colors"
        onClick={e => { e.stopPropagation(); onFavorite && onFavorite() }}
        title={isFavorite ? 'Unfavorite' : 'Favorite'}
        aria-label={isFavorite ? 'Unfavorite card' : 'Favorite card'}
      >
        {isFavorite ? <Star className="w-5 h-5 text-primary-600" /> : <StarOff className="w-5 h-5 text-secondary-400" />}
      </button>
      <div className="absolute bottom-3 left-3 text-xs text-secondary-500">
        Card {cardIndex + 1} / {totalCards}
      </div>
      {flipped && (
        <button
          className="absolute bottom-3 right-3 flex items-center space-x-1 text-primary-600 hover:underline text-xs"
          onClick={e => { e.stopPropagation(); setFlipped(false); }}
          title="Flip back"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Flip back</span>
        </button>
      )}
    </div>
  )
}

export default FlashCard 