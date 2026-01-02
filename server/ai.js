import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeQuery(query, databaseType = 'postgresql') {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2, // Lower temperature for more focused, faster responses
      topP: 0.8,
    }
  });

  const prompt = `SQL: ${query} (${databaseType}). Return JSON ONLY: { "workload_category": "FAST|MODERATE|HEAVY", "estimated_execution_time": "time str", "estimated_rows_scanned": number, "detected_issues": ["str"], "optimization_suggestions": ["str"], "index_suggestions": ["str"], "optimized_query": "better sql", "explanation": "explain", "performance_comparison": {"original_cost": 100, "optimized_cost": 50, "improvement_percent": 50} }`;

  try {
    console.log(`[${new Date().toLocaleTimeString()}] Calling Gemini API...`);
    const result = await model.generateContent(prompt);
    console.log(`[${new Date().toLocaleTimeString()}] Gemini response received.`);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Invalid AI response:', text);
      throw new Error('Failed to parse AI response as JSON');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('[ERROR] Gemini Analysis:', error.message);
    throw error;
  }
}
