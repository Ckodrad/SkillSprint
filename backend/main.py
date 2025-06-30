from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from typing import List, Dict, Optional
import io
import re
import random
import os
import openai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_text(text: str) -> str:
    """Clean and normalize text content"""
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    # Remove special characters that might cause issues
    text = re.sub(r'[^\w\s\.\,\!\?\-\:]', '', text)
    return text

def extract_key_concepts(text: str) -> List[str]:
    """Extract key concepts from text for better question generation"""
    # Simple keyword extraction - in a real app, you'd use NLP libraries
    words = re.findall(r'\b\w+\b', text.lower())
    # Filter out common words and short words
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'}
    keywords = [word for word in words if len(word) > 3 and word not in stop_words]
    # Return unique keywords, prioritizing longer words
    return list(set(keywords))[:10]

def generate_question_from_content(heading: str, content: str) -> Dict:
    """Generate a proper question from content"""
    # Clean the content
    clean_content = clean_text(content)
    if len(clean_content) < 20:
        return None
    
    # Extract key concepts
    concepts = extract_key_concepts(clean_content)
    if not concepts:
        return None
    
    # Generate question based on content type
    question_types = [
        {
            "question": f"What is the main purpose of {concepts[0] if concepts else 'this topic'}?",
            "type": "purpose"
        },
        {
            "question": f"Which of the following best describes {concepts[0] if concepts else 'the main concept'}?",
            "type": "definition"
        },
        {
            "question": f"What are the key benefits of {concepts[0] if concepts else 'this approach'}?",
            "type": "benefits"
        },
        {
            "question": f"How does {concepts[0] if concepts else 'this process'} work?",
            "type": "process"
        }
    ]
    
    selected_type = random.choice(question_types)
    
    # Generate plausible options
    correct_answer = concepts[0] if concepts else "the main concept"
    wrong_options = [
        "an unrelated process",
        "a different approach",
        "an outdated method",
        "a competing technology"
    ]
    
    # Shuffle options
    all_options = [correct_answer] + wrong_options[:3]
    random.shuffle(all_options)
    
    return {
        "question": selected_type["question"],
        "options": all_options,
        "correct": correct_answer,
        "explanation": f"This question tests understanding of {concepts[0] if concepts else 'the main topic'}."
    }

def create_concise_flashcard(heading: str, content: str) -> Dict:
    """Create a concise flashcard from content"""
    # Clean and summarize content
    clean_content = clean_text(content)
    
    # Extract key points (first sentence or first 100 characters)
    if len(clean_content) > 100:
        # Find the first complete sentence
        sentences = re.split(r'[.!?]+', clean_content)
        key_point = sentences[0] if sentences else clean_content[:100]
    else:
        key_point = clean_content
    
    # Create a concise front and back
    front = heading if heading else "Key Concept"
    back = key_point[:150] + "..." if len(key_point) > 150 else key_point
    
    return {
        "front": front,
        "back": back,
        "category": "main"
    }

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("DEBUG: No OpenAI API key found")
        return None
    print(f"DEBUG: OpenAI API key found (length: {len(api_key)})")
    return openai.OpenAI(api_key=api_key)

async def openai_summarize(text: str) -> str:
    client = get_openai_client()
    if not client:
        return None
    prompt = f"""
    Create a concise flashcard answer (max 60 words) from this content. Focus on the single most important concept. Use clear, simple language. Avoid jargon unless essential. Make it memorable and easy to recall.
    
    Content: {text}
    
    Flashcard answer:"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=60,
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI error in summarize: {e}")
        return None

async def openai_generate_question(heading: str, content: str) -> dict:
    client = get_openai_client()
    if not client:
        return None
    prompt = f"""
    Based on the following content, write a single multiple-choice question (MCQ) with 4 short, plausible options. The question should be clear and not just copy a paragraph. Mark the correct answer. Format your response as JSON with keys: question, options (list), correct (string). Do not include explanations or extra text.
    Heading: {heading}
    Content: {content}
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.7,
        )
        import json
        # Find the first JSON object in the response
        import re
        match = re.search(r'\{.*\}', response.choices[0].message.content, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return None
    except Exception as e:
        print(f"OpenAI error in generate_question: {e}")
        return None

@app.post("/parse")
async def parse_pdf(file: UploadFile = File(...)):
    try:
        content = {"title": file.filename, "slides": [], "totalSlides": 0}
        pdf_bytes = await file.read()
        
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
        except Exception as e:
            # If PDF parsing fails, return a mock structure
            return {
                "title": file.filename,
                "slides": [
                    {
                        "slideNumber": 1,
                        "headings": ["Sample Content"],
                        "paragraphs": ["This is sample content for demonstration purposes."],
                        "rawText": "Sample Content\nThis is sample content for demonstration purposes."
                    }
                ],
                "totalSlides": 1
            }
        
        slides = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            if not text.strip():
                continue
                
            # Better text processing
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            
            # Extract heading (first line or first capitalized line)
            heading = ""
            paragraphs = []
            
            if lines:
                # Find the first line that looks like a heading
                for line in lines[:3]:  # Check first 3 lines
                    if len(line) < 100 and (line.isupper() or line[0].isupper() and len(line.split()) <= 8):
                        heading = line
                        break
                
                if not heading and lines:
                    heading = lines[0][:50]  # Use first line as heading if short
                
                # Collect remaining content as paragraphs
                remaining_lines = [l for l in lines if l != heading]
                if remaining_lines:
                    # Group lines into paragraphs
                    current_paragraph = []
                    for line in remaining_lines:
                        if len(line) > 20:  # Likely a content line
                            current_paragraph.append(line)
                        elif current_paragraph:  # End of paragraph
                            paragraphs.append(" ".join(current_paragraph))
                            current_paragraph = []
                    
                    if current_paragraph:  # Add last paragraph
                        paragraphs.append(" ".join(current_paragraph))
            
            slide = {
                "slideNumber": i + 1,
                "headings": [heading] if heading else [],
                "paragraphs": paragraphs,
                "rawText": text
            }
            slides.append(slide)
        
        content["slides"] = slides
        content["totalSlides"] = len(slides)
        return content
        
    except Exception as e:
        return {"error": f"Failed to parse PDF: {str(e)}"}

@app.post("/generate-quiz")
async def generate_quiz(parsed: Dict):
    """Generate quiz questions using OpenAI if available"""
    questions = []
    use_openai = get_openai_client() is not None
    
    for slide in parsed.get("slides", []):
        if not slide.get("headings") or not slide.get("paragraphs"):
            continue
        heading = slide["headings"][0]
        content = " ".join(slide["paragraphs"])
        if use_openai:
            q = await openai_generate_question(heading, content)
            if q:
                questions.append(q)
        else:
            question = generate_question_from_content(heading, content)
            if question:
                questions.append(question)
    if not questions:
        questions = [
            {
                "question": "What is the main topic of this document?",
                "options": ["Learning and education", "Technology", "Business", "Science"],
                "correct": "Learning and education",
            },
            {
                "question": "Which learning method is most effective for retention?",
                "options": ["Active recall", "Passive reading", "Skimming", "Memorization"],
                "correct": "Active recall",
            }
        ]
    return {"questions": questions[:5]}

@app.post("/generate-flashcards")
async def generate_flashcards(parsed: Dict):
    """Generate concise flashcards using OpenAI if available"""
    flashcards = []
    use_openai = get_openai_client() is not None
    for slide in parsed.get("slides", []):
        if not slide.get("headings") or not slide.get("paragraphs"):
            continue
        heading = slide["headings"][0]
        content = " ".join(slide["paragraphs"])
        if use_openai:
            summary = await openai_summarize(content)
            back = summary if summary else content[:150]
        else:
            flashcard = create_concise_flashcard(heading, content)
            back = flashcard["back"]
        flashcards.append({
            "front": heading if heading else "Key Concept",
            "back": back,
            "category": "main"
        })
    if not flashcards:
        flashcards = [
            {
                "front": "What is micro-learning?",
                "back": "A learning approach that delivers content in small, focused units for better retention and engagement.",
                "category": "concept"
            },
            {
                "front": "Key benefit of flashcards",
                "back": "Active recall practice that strengthens memory and improves long-term retention.",
                "category": "benefit"
            }
        ]
    return {"flashcards": flashcards[:10]} 