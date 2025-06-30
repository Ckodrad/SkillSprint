import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, ChevronLeft, ChevronRight, Timer, Star, StarOff, Play, Pause } from 'lucide-react'
import FlashCard from '../components/FlashCard'
import Quiz from '../components/Quiz'

const MOCK_QUIZ = [
  {
    question: 'What is SkillSprint designed to do?',
    options: [
      'Generate micro-lessons from lecture files',
      'Replace university lectures',
      'Provide video tutorials',
      'Grade assignments automatically',
    ],
    correct: 'Generate micro-lessons from lecture files',
  },
  {
    question: 'Which learning science principle does SkillSprint use?',
    options: [
      'Spaced repetition',
      'Rote memorization',
      'Guesswork',
      'None of the above',
    ],
    correct: 'Spaced repetition',
  },
]

const FOCUS_TIME = 60 // seconds

const Lesson = () => {
  const { id } = useParams()
  const [lessonData, setLessonData] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFlashCards, setShowFlashCards] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [focusMode, setFocusMode] = useState(false)
  const [focusTime, setFocusTime] = useState(FOCUS_TIME)
  const [focusInterval, setFocusInterval] = useState(null)

  useEffect(() => {
    // Load lesson data from localStorage (demo purposes)
    const storedData = localStorage.getItem(`lesson_${id}`)
    if (storedData) {
      setLessonData(JSON.parse(storedData))
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    if (focusMode && focusTime > 0) {
      const interval = setInterval(() => setFocusTime(t => t - 1), 1000)
      setFocusInterval(interval)
      return () => clearInterval(interval)
    } else if (focusTime === 0) {
      setFocusMode(false)
      setFocusInterval(null)
    }
  }, [focusMode, focusTime])

  const nextSlide = () => {
    if (currentSlide < lessonData.slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleFavorite = (idx) => {
    setFavorites(favs => favs.includes(idx) ? favs.filter(i => i !== idx) : [...favs, idx])
  }

  const handleFocusToggle = () => {
    setFocusMode(f => !f)
    if (!focusMode) setFocusTime(FOCUS_TIME)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Generating your lesson, please wait...</p>
        </div>
      </div>
    )
  }

  if (!lessonData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <h2 className="text-xl font-semibold mb-4">Lesson Not Found</h2>
          <p className="text-secondary-600 mb-4">
            The lesson you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/upload" className="btn-primary">
            Upload New File
          </Link>
        </div>
      </div>
    )
  }

  const currentSlideData = lessonData.slides[currentSlide]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="btn-secondary flex items-center space-x-2" title="Back to Home">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">{lessonData.title}</h1>
            <p className="text-secondary-600">
              {lessonData.totalSlides} slides • Slide {currentSlide + 1} of {lessonData.totalSlides}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="btn-primary flex items-center space-x-2"
            onClick={() => setShowFlashCards(f => !f)}
            title="Study with Flash-Cards"
          >
            <Star className="w-4 h-4" />
            <span>Flash-Cards</span>
          </button>
          <button
            className="btn-primary flex items-center space-x-2"
            onClick={() => setShowQuiz(f => !f)}
            title="Take Quiz"
          >
            <FileText className="w-4 h-4" />
            <span>Quiz</span>
          </button>
          <button
            className={`btn-secondary flex items-center space-x-2 ${focusMode ? 'ring-2 ring-primary-400' : ''}`}
            onClick={handleFocusToggle}
            title="Toggle Focus Mode (60s)"
          >
            <Timer className="w-4 h-4" />
            <span>{focusMode ? 'Stop Focus' : 'Start Focus'}</span>
          </button>
          <Link to="/lesson/last" className="btn-primary flex items-center space-x-2" title="Resume Lesson">
            <Play className="w-4 h-4" />
            <span>Resume Lesson</span>
          </Link>
        </div>
      </div>

      {/* Focus Mode Timer */}
      {focusMode && (
        <div className="mb-4 flex items-center justify-center">
          <div className="bg-primary-100 text-primary-800 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Timer className="w-5 h-5" />
            <span>Focus Mode: {focusTime}s left</span>
            <button className="ml-2 text-xs underline" onClick={handleFocusToggle}><Pause className="w-4 h-4 inline" /> Stop</button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / lessonData.totalSlides) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-secondary-600 mt-2">
          <span>Slide {currentSlide + 1}</span>
          <span>{Math.round(((currentSlide + 1) / lessonData.totalSlides) * 100)}% Complete</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Slide Content or FlashCards/Quiz */}
        <div className="lg:col-span-2">
          {showFlashCards ? (
            <div className="space-y-6">
              {lessonData.slides.map((slide, idx) => (
                <FlashCard
                  key={idx}
                  front={slide.headings[0] || `Slide ${slide.slideNumber}`}
                  back={slide.paragraphs[0] || slide.rawText}
                  onFavorite={() => handleFavorite(idx)}
                  isFavorite={favorites.includes(idx)}
                  cardIndex={idx}
                  totalCards={lessonData.slides.length}
                />
              ))}
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-secondary" onClick={() => setShowFlashCards(false)} title="Back to Lesson">Back to Lesson</button>
                <button className="btn-primary" onClick={() => setFavorites([])} title="Clear Favorites">Clear Favorites</button>
              </div>
            </div>
          ) : showQuiz ? (
            <Quiz questions={MOCK_QUIZ} onComplete={() => {}} />
          ) : (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Slide {currentSlideData.slideNumber}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="p-2 rounded-lg hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    disabled={currentSlide === lessonData.slides.length - 1}
                    className="p-2 rounded-lg hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {/* Headings */}
              {currentSlideData.headings.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-primary-600 mb-3">Headings</h3>
                  <div className="space-y-2">
                    {currentSlideData.headings.map((heading, index) => (
                      <div key={index} className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                        <p className="font-medium text-primary-900">{heading}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Paragraphs */}
              {currentSlideData.paragraphs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-secondary-700 mb-3">Content</h3>
                  <div className="space-y-3">
                    {currentSlideData.paragraphs.map((paragraph, index) => (
                      <div key={index} className="bg-secondary-50 border border-secondary-200 rounded-lg p-3">
                        <p className="text-secondary-800">{paragraph}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Raw Text */}
              <div>
                <h3 className="text-lg font-medium text-secondary-700 mb-3">Raw Text</h3>
                <div className="bg-secondary-100 border border-secondary-300 rounded-lg p-4">
                  <p className="text-sm text-secondary-700 whitespace-pre-wrap">
                    {currentSlideData.rawText}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson Info */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Lesson Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-secondary-600">Title:</span>
                <p className="text-secondary-900">{lessonData.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Total Slides:</span>
                <p className="text-secondary-900">{lessonData.totalSlides}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Current Slide:</span>
                <p className="text-secondary-900">{currentSlide + 1}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Favorites:</span>
                <p className="text-secondary-900">{favorites.length}</p>
              </div>
            </div>
          </div>
          {/* Slide Navigation */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Slide Navigation</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {lessonData.slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentSlide
                      ? 'bg-primary-100 border border-primary-300 text-primary-900'
                      : 'hover:bg-secondary-100 text-secondary-700'
                  }`}
                  title={`Go to Slide ${slide.slideNumber}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Slide {slide.slideNumber}</span>
                    {index === currentSlide && (
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    )}
                  </div>
                  {slide.headings.length > 0 && (
                    <p className="text-sm text-secondary-600 mt-1 truncate">
                      {slide.headings[0]}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* Next Steps */}
          <div className="card bg-primary-50 border-primary-200">
            <h3 className="text-lg font-semibold mb-4 text-primary-900">Next Steps</h3>
            <div className="space-y-3">
              <p className="text-sm text-primary-800">
                This is the Round 2 prototype with flash-cards, quiz, focus mode, favorites, and improved UI. Future iterations will add more advanced features.
              </p>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• More advanced quiz generation</li>
                <li>• Spaced repetition scheduling</li>
                <li>• Study streaks and reminders</li>
                <li>• Export and review features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      {!showFlashCards && !showQuiz && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-secondary-200">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <div className="text-center">
            <p className="text-sm text-secondary-600">
              Slide {currentSlide + 1} of {lessonData.totalSlides}
            </p>
          </div>
          <button
            onClick={nextSlide}
            disabled={currentSlide === lessonData.slides.length - 1}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Slide"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Lesson 