// n8n Integration Service for Recruit AI
// This connects to your n8n workflow for AI-powered resume analysis

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

export interface ResumeAnalysisRequest {
  candidateName: string;
  resumeText: string;
  jobDescription: string;
  jobTitle: string;
}

export interface ResumeAnalysisResponse {
  score: number;
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'interview' | 'reject' | 'review';
}

// Analyze resume using n8n + Gemini workflow
export async function analyzeResume(request: ResumeAnalysisRequest): Promise<ResumeAnalysisResponse> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('n8n webhook is not configured. Please add VITE_N8N_WEBHOOK_URL to your environment.');
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidateName: request.candidateName,
        resumeText: request.resumeText,
        jobDescription: request.jobDescription,
        jobTitle: request.jobTitle,
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw n8n response:', JSON.stringify(data, null, 2));
    return parseGeminiResponse(data, request.candidateName);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}

// Parse the response from Gemini via n8n
function parseGeminiResponse(data: unknown, candidateName: string): ResumeAnalysisResponse {
  try {
    console.log('Parsing response for:', candidateName);
    let content = '';
    
    // Handle array response (n8n sometimes returns array)
    let responseData = data;
    if (Array.isArray(data) && data.length > 0) {
      responseData = data[0];
      console.log('Unwrapped array response');
    }
    
    if (responseData && typeof responseData === 'object') {
      const objData = responseData as Record<string, unknown>;
      
      // Check for direct score (already parsed JSON)
      if (typeof objData.score === 'number') {
        console.log('Found direct score:', objData.score);
        return {
          score: objData.score,
          analysis: (objData.analysis as string) || '',
          strengths: (objData.strengths as string[]) || [],
          weaknesses: (objData.weaknesses as string[]) || [],
          recommendation: (objData.recommendation as 'interview' | 'reject' | 'review') || 'review',
        };
      }
      
      // Check for Gemini API response structure: candidates[0].content.parts[0].text
      if (objData.candidates && Array.isArray(objData.candidates)) {
        const candidates = objData.candidates as Array<{content?: {parts?: Array<{text?: string}>}}>;
        content = candidates[0]?.content?.parts?.[0]?.text || '';
        console.log('Found Gemini candidates structure, text length:', content.length);
      }
      // Check for text field directly
      else if (typeof objData.text === 'string') {
        content = objData.text;
        console.log('Found text field');
      }
      // Check for content.parts structure
      else if (objData.content && typeof objData.content === 'object') {
        const contentObj = objData.content as { parts?: Array<{text?: string}> };
        content = contentObj.parts?.[0]?.text || '';
        console.log('Found content.parts structure');
      }
    }

    if (content) {
      console.log('Raw content:', content.substring(0, 200) + '...');
      
      // Clean markdown code blocks
      content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      
      // Try to find JSON object in the content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('Found JSON match');
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('Parsed score:', parsed.score);
          return {
            score: typeof parsed.score === 'number' ? parsed.score : 50,
            analysis: parsed.analysis || content,
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
            recommendation: parsed.recommendation || (parsed.score > 70 ? 'interview' : 'review'),
          };
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
        }
      }
      
      // If no JSON found, return the content as analysis with default score
      console.log('No JSON found, using content as analysis');
      return {
        score: 50,
        analysis: content,
        strengths: [],
        weaknesses: [],
        recommendation: 'review',
      };
    }

    console.log('No content found in response');
    return {
      score: 50,
      analysis: `Analysis completed for ${candidateName}. Please review manually.`,
      strengths: [],
      weaknesses: [],
      recommendation: 'review',
    };
  } catch (error) {
    console.error('Error parsing response:', error);
    return {
      score: 50,
      analysis: `Unable to parse AI analysis for ${candidateName}. Please review manually.`,
      strengths: [],
      weaknesses: [],
      recommendation: 'review',
    };
  }
}

// Extract text from uploaded file (supports PDF and TXT)
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  }
  
  // Default: read as text
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Extract text from PDF
async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  
  // Set worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageText = (textContent.items as any[])
      .filter((item) => 'str' in item)
      .map((item) => item.str || '')
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText.trim();
}

// Check if n8n is configured
export function isN8nConfigured(): boolean {
  return !!N8N_WEBHOOK_URL;
}
