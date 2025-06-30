// PDF.js worker setup
import * as pdfjsLib from 'pdfjs-dist'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

const API_URL = 'http://localhost:8000'

/**
 * Parse PDF file and extract structured content
 * @param {File} file - PDF file to parse
 * @returns {Promise<Object>} Structured content with headings and paragraphs
 */
export const parsePDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    const content = {
      title: file.name.replace('.pdf', ''),
      slides: [],
      totalSlides: pdf.numPages
    }
    
    // Extract content from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      const slideContent = {
        slideNumber: pageNum,
        headings: [],
        paragraphs: [],
        rawText: ''
      }
      
      // Process text content
      let currentText = ''
      let currentFontSize = 0
      let isHeading = false
      
      for (const item of textContent.items) {
        const text = item.str
        const fontSize = item.height
        
        // Determine if this is a heading based on font size
        if (fontSize > currentFontSize + 2) {
          if (currentText.trim()) {
            if (isHeading) {
              slideContent.headings.push(currentText.trim())
            } else {
              slideContent.paragraphs.push(currentText.trim())
            }
          }
          currentText = text
          currentFontSize = fontSize
          isHeading = fontSize > 14 // Assume headings are larger than 14px
        } else {
          currentText += text
        }
      }
      
      // Add remaining text
      if (currentText.trim()) {
        if (isHeading) {
          slideContent.headings.push(currentText.trim())
        } else {
          slideContent.paragraphs.push(currentText.trim())
        }
      }
      
      slideContent.rawText = textContent.items.map(item => item.str).join(' ')
      content.slides.push(slideContent)
    }
    
    return content
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error('Failed to parse PDF file')
  }
}

/**
 * Parse PowerPoint file and extract structured content
 * @param {File} file - PowerPoint file to parse
 * @returns {Promise<Object>} Structured content with headings and paragraphs
 */
export const parsePowerPoint = async (file) => {
  try {
    // For this prototype, we'll simulate PowerPoint parsing
    // In a real implementation, you would use a library like python-pptx on the backend
    const content = {
      title: file.name.replace(/\.(pptx|ppt)$/i, ''),
      slides: [],
      totalSlides: 0
    }
    
    // Simulate parsing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate mock content for demonstration
    const mockSlides = [
      {
        slideNumber: 1,
        headings: ['Introduction to SkillSprint'],
        paragraphs: ['Welcome to the micro-learning platform that transforms your study materials into actionable content.'],
        rawText: 'Introduction to SkillSprint. Welcome to the micro-learning platform that transforms your study materials into actionable content.'
      },
      {
        slideNumber: 2,
        headings: ['Key Features'],
        paragraphs: ['Fast processing, AI-powered content generation, and evidence-based learning methods.'],
        rawText: 'Key Features. Fast processing, AI-powered content generation, and evidence-based learning methods.'
      },
      {
        slideNumber: 3,
        headings: ['How It Works'],
        paragraphs: ['Upload your materials, let AI process them, and start studying with generated flash-cards and quizzes.'],
        rawText: 'How It Works. Upload your materials, let AI process them, and start studying with generated flash-cards and quizzes.'
      }
    ]
    
    content.slides = mockSlides
    content.totalSlides = mockSlides.length
    
    return content
  } catch (error) {
    console.error('Error parsing PowerPoint:', error)
    throw new Error('Failed to parse PowerPoint file')
  }
}

/**
 * Parse any supported file type
 * @param {File} file - File to parse
 * @returns {Promise<Object>} Structured content
 */
export const parseFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_URL}/parse`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Failed to parse file')
  return await res.json()
}

/**
 * Generate quiz based on parsed content
 * @param {Object} parsedContent - Structured content to generate quiz from
 * @returns {Promise<Object>} Generated quiz
 */
export const generateQuiz = async (parsedContent) => {
  const res = await fetch(`${API_URL}/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedContent),
  })
  if (!res.ok) throw new Error('Failed to generate quiz')
  return await res.json()
}

/**
 * Validate file before parsing
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateFile = (file) => {
  const maxSize = 100 * 1024 * 1024 // 100MB
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint'
  ]
  
  const fileName = file.name.toLowerCase()
  const isSupportedExtension = fileName.endsWith('.pdf') || 
                              fileName.endsWith('.pptx') || 
                              fileName.endsWith('.ppt')
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 100MB' }
  }
  
  if (!supportedTypes.includes(file.type) && !isSupportedExtension) {
    return { valid: false, error: 'Please upload a PDF or PowerPoint file' }
  }
  
  return { valid: true }
} 