import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Upload, Home } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
            <BookOpen className="w-8 h-8" />
            <span className="text-xl font-bold">SkillSprint</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/upload" 
              className="flex items-center space-x-1 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 