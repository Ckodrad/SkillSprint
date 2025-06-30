import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileText, File, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { parseFile, validateFile } from '../utils/fileParser'

const Upload = () => {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [parsedContent, setParsedContent] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const navigate = useNavigate()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (selectedFile) => {
    setError(null)
    setParsedContent(null)
    
    const validation = validateFile(selectedFile)
    if (!validation.valid) {
      setError(validation.error)
      return
    }
    
    setFile(selectedFile)
  }

  const handleFileUpload = async () => {
    if (!file) return
    
    setIsUploading(true)
    setError(null)
    
    try {
      const content = await parseFile(file)
      setParsedContent(content)
      
      // Store in localStorage for demo purposes
      const lessonId = Date.now().toString()
      localStorage.setItem(`lesson_${lessonId}`, JSON.stringify(content))
      
      // Navigate to lesson page
      navigate(`/lesson/${lessonId}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Upload Your Lecture Materials
        </h1>
        <p className="text-secondary-600">
          Upload a PDF or PowerPoint file to generate your personalized micro-lesson
        </p>
      </div>

      {/* File Upload Area */}
      <div className="card mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary-400 bg-primary-50' 
              : 'border-secondary-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          
          {!file ? (
            <>
              <h3 className="text-lg font-semibold mb-2">Drop your file here</h3>
              <p className="text-secondary-600 mb-4">
                or click to browse your files
              </p>
              <input
                type="file"
                accept=".pdf,.pptx,.ppt"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                Choose File
              </label>
              <p className="text-sm text-secondary-500 mt-4">
                Supported formats: PDF, PowerPoint (PPTX, PPT) • Max size: 100MB
              </p>
            </>
          ) : (
            <div className="text-left">
              <div className="flex items-center space-x-3 mb-4">
                {file.type.includes('pdf') ? (
                  <FileText className="w-8 h-8 text-error-500" />
                ) : (
                  <File className="w-8 h-8 text-primary-500" />
                )}
                <div>
                  <h3 className="font-semibold">{file.name}</h3>
                  <p className="text-sm text-secondary-600">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-success-500 ml-auto" />
              </div>
              
              <button
                onClick={handleFileUpload}
                disabled={isUploading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4" />
                    <span>Generate Micro-Lesson</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card border-error-200 bg-error-50 mb-8">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-error-500" />
            <p className="text-error-700">{error}</p>
          </div>
        </div>
      )}

      {/* Parsed Content Preview */}
      {parsedContent && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Content Structure</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-secondary-900">Title: {parsedContent.title}</h3>
              <p className="text-sm text-secondary-600">
                {parsedContent.totalSlides} slides detected
              </p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {parsedContent.slides.map((slide, index) => (
                <div key={index} className="border border-secondary-200 rounded-lg p-4 mb-3">
                  <h4 className="font-medium text-secondary-900 mb-2">
                    Slide {slide.slideNumber}
                  </h4>
                  
                  {slide.headings.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-primary-600">Headings:</span>
                      <ul className="text-sm text-secondary-700 ml-4">
                        {slide.headings.map((heading, hIndex) => (
                          <li key={hIndex}>• {heading}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {slide.paragraphs.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-secondary-600">Content:</span>
                      <p className="text-sm text-secondary-700 ml-4">
                        {slide.paragraphs.join(' ')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Preview */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-semibold mb-2">Smart Parsing</h3>
          <p className="text-sm text-secondary-600">
            Automatically extracts headings, paragraphs, and key content from your files
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-success-600" />
          </div>
          <h3 className="font-semibold mb-2">Structured Output</h3>
          <p className="text-sm text-secondary-600">
            Generates organized JSON data ready for micro-lesson creation
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-warning-600" />
          </div>
          <h3 className="font-semibold mb-2">Error Handling</h3>
          <p className="text-sm text-secondary-600">
            Robust validation and error reporting for various file formats
          </p>
        </div>
      </div>
    </div>
  )
}

export default Upload 