import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Zap, Target, Clock, CheckCircle } from 'lucide-react'

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <BookOpen className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Transform Your Lecture Materials Into
            <span className="text-primary-600"> Micro-Lessons</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            SkillSprint is your one-click personal tutor that converts PDFs and slides into 
            flash-cards, summaries, and quizzes in seconds.
          </p>
          <Link to="/upload" className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Start Learning Now</span>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
          <p className="text-secondary-600">
            Generate complete micro-lessons in under 5 seconds from any PDF or PowerPoint file.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-success-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Evidence-Based</h3>
          <p className="text-secondary-600">
            Built on spaced repetition and cognitive load theory for maximum retention.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-warning-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Time-Saving</h3>
          <p className="text-secondary-600">
            Cut preparation time by 50% compared to manual flash-card creation.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="card mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="font-semibold mb-2">Upload Your Materials</h3>
            <p className="text-secondary-600">
              Upload PDF or PowerPoint lecture files (up to 100MB)
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="font-semibold mb-2">AI Processing</h3>
            <p className="text-secondary-600">
              Our AI extracts content and generates structured learning materials
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="font-semibold mb-2">Study & Practice</h3>
            <p className="text-secondary-600">
              Review summaries, practice flash-cards, and take quizzes
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="card bg-primary-50 border-primary-200">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Study Habits?</h2>
          <p className="text-secondary-600 mb-6">
            Join thousands of students who are already learning more effectively with SkillSprint.
          </p>
          <Link to="/upload" className="btn-primary text-lg px-8 py-3">
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home 