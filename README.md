# SkillSprint - One-Click Micro-Learning Platform

SkillSprint is a web-based tool that transforms lecture materials (PDFs and PowerPoint files) into structured, study-ready micro-lessons. This prototype represents the **first iteration** of the project, focusing on the foundation and import engine.

## 🎯 Project Overview

Based on the requirements from the Agile Software Projects report, SkillSprint aims to:

- **Cut preparation time by 50%** compared to manual flash-card creation
- **Generate micro-lessons in under 5 seconds** for a 20-slide deck
- **Achieve 80%+ accuracy** in generated quiz content
- **Improve delayed recall by 20%** through evidence-based learning methods

## 🚀 First Iteration Features

This prototype implements the core functionality from **Sprint 1-2: Foundation & Import Engine**:

### ✅ Implemented Features
- **File Upload & Validation**: Support for PDF and PowerPoint files (up to 100MB)
- **Smart Content Parsing**: Extracts headings, paragraphs, and structured content
- **JSON Output**: Generates organized data structure ready for micro-lesson creation
- **Responsive UI**: Modern, accessible interface following Material Design principles
- **Error Handling**: Robust validation and user-friendly error messages
- **Content Preview**: Visual display of parsed content structure

### 📋 Technical Implementation
- **Frontend**: React with Vite for fast development
- **Styling**: Tailwind CSS with custom design system
- **PDF Parsing**: PDF.js for client-side PDF processing
- **File Validation**: Comprehensive file type and size validation
- **State Management**: React hooks for local state management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skillsprint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Header.jsx      # Navigation header
├── pages/              # Main application pages
│   ├── Home.jsx        # Landing page
│   ├── Upload.jsx      # File upload interface
│   └── Lesson.jsx      # Content display page
├── utils/              # Utility functions
│   └── fileParser.js   # PDF/PPT parsing logic
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

- **Primary Colors**: Blue-based palette for main actions
- **Secondary Colors**: Gray-based palette for content
- **Success/Warning/Error**: Semantic color coding
- **Typography**: Inter font family for readability
- **Components**: Consistent card, button, and input styles

## 🔧 Usage Guide

### 1. Upload a File
- Navigate to the Upload page
- Drag and drop a PDF or PowerPoint file, or click to browse
- Supported formats: `.pdf`, `.pptx`, `.ppt`
- Maximum file size: 100MB

### 2. View Parsed Content
- After upload, the system processes your file
- View the extracted content structure with headings and paragraphs
- Navigate through slides using the interface

### 3. Content Structure
Each parsed file generates:
- **Title**: Extracted from filename
- **Slides**: Individual page/slide content
- **Headings**: Automatically detected based on font size
- **Paragraphs**: Body text content
- **Raw Text**: Complete text extraction

## 🎯 Key Metrics (First Iteration)

### Performance Targets
- **Parsing Speed**: < 5 seconds for 20-slide deck ✅
- **File Size Support**: Up to 100MB ✅
- **Format Support**: PDF and PowerPoint ✅

### Quality Metrics
- **Content Extraction**: Structured JSON output ✅
- **Error Handling**: Comprehensive validation ✅
- **User Experience**: Intuitive drag-and-drop interface ✅

## 🔮 Future Iterations

Based on the project roadmap, upcoming iterations will include:

### Sprint 3-4: Quiz Generator Core
- AI-powered quiz question generation
- Bloom's taxonomy alignment
- Multiple choice question validation

### Sprint 5-6: Usability & Micro-Lesson Flow
- Flash-card generation
- Interactive study sessions
- Progress tracking

### Sprint 7-8: Refinement & Evaluation
- Spaced repetition algorithm
- User testing and SUS scoring
- Performance optimization

## 🧪 Testing

### Manual Testing
1. **File Upload**: Test with various PDF and PowerPoint files
2. **Content Parsing**: Verify heading and paragraph extraction
3. **Error Handling**: Test with invalid files and edge cases
4. **Responsive Design**: Test on different screen sizes

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📊 Risk Management

### Identified Risks
- **Complex PDF Layouts**: May affect parsing accuracy
- **Large File Processing**: Could impact performance
- **Browser Compatibility**: PDF.js worker requirements

### Mitigation Strategies
- **Edge Case Testing**: Comprehensive file format testing
- **Performance Monitoring**: File size and processing time limits
- **Fallback Options**: Graceful degradation for unsupported formats

## 🤝 Contributing

This is a prototype for academic purposes. For future development:

1. Follow the established code style
2. Add tests for new features
3. Update documentation for changes
4. Ensure accessibility compliance

## 📄 License

This project is created for educational purposes as part of an Agile Software Projects course.

## 📞 Support

For questions or issues with this prototype, please refer to the project documentation or contact the development team.

---

**Note**: This prototype represents the first iteration of SkillSprint. It focuses on the foundation and import engine as specified in the project requirements. Future iterations will build upon this foundation to create a complete micro-learning platform. 