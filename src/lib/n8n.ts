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
    return parseGeminiResponse(data, request.candidateName);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}

// Parse the response from Gemini via n8n
function parseGeminiResponse(data: unknown, candidateName: string): ResumeAnalysisResponse {
  try {
    let content = '';
    
    if (data && typeof data === 'object') {
      const responseData = data as Record<string, unknown>;
      
      // Check for Gemini API response structure
      if (responseData.candidates && Array.isArray(responseData.candidates)) {
        const candidates = responseData.candidates as Array<{content?: {parts?: Array<{text?: string}>}}>;
        content = candidates[0]?.content?.parts?.[0]?.text || '';
      }
      // Check if n8n returned parsed JSON directly
      else if (responseData.score !== undefined) {
        return {
          score: responseData.score as number,
          analysis: (responseData.analysis as string) || '',
          strengths: (responseData.strengths as string[]) || [],
          weaknesses: (responseData.weaknesses as string[]) || [],
          recommendation: (responseData.recommendation as 'interview' | 'reject' | 'review') || 'review',
        };
      }
      // Check for text field
      else if (typeof responseData.text === 'string') {
        content = responseData.text;
      }
    }

    if (content) {
      // Clean markdown code blocks
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          score: parsed.score || 50,
          analysis: parsed.analysis || content,
          strengths: parsed.strengths || [],
          weaknesses: parsed.weaknesses || [],
          recommendation: parsed.recommendation || (parsed.score > 70 ? 'interview' : 'reject'),
        };
      }
      
      return {
        score: 50,
        analysis: content,
        strengths: [],
        weaknesses: [],
        recommendation: 'review',
      };
    }

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

// Extract text from uploaded file
export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Check if n8n is configured
export function isN8nConfigured(): boolean {
  return !!N8N_WEBHOOK_URL;
}
