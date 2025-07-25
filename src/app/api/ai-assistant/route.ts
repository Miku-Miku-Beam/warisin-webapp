import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, programTitle, category, duration, location } = await request.json();

    // Validate required fields
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Construct a detailed prompt for Gemini
    const fullPrompt = `
As an AI assistant for Indonesian cultural heritage artisans, help me create an engaging and professional program description for cultural heritage training.

Program Details:
- Title: ${programTitle || 'Cultural Heritage Program'}
- Category: ${category || 'Cultural Heritage'}
- Duration: ${duration || 'To be determined'}
- Location: ${location || 'To be determined'}
- Artisan Input: ${prompt}

Your Tasks:
1. Create an engaging and easy-to-understand program description
2. Use proper English language
3. Include benefits that participants will gain
4. Briefly explain the learning process
5. Create a description between 150-300 words
6. Use a friendly and inviting tone

Focus on cultural heritage learning aspects and practical skill development. Make sure the description is informative, inspiring, and clearly communicates the value of the program.
`;

    console.log('Making request to Gemini API...');
    console.log('API Key present:', !!geminiApiKey);
    console.log('Prompt length:', prompt.length);

    // Try using gemini-1.5-flash which is more reliable
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error details:');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Error Body:', errorText);
      
      // Check for specific error types
      if (response.status === 400) {
        throw new Error(`Bad request to Gemini API. Check your prompt format. Details: ${errorText}`);
      } else if (response.status === 401) {
        throw new Error(`API key authentication failed. Please check your Gemini API key.`);
      } else if (response.status === 403) {
        throw new Error(`API access forbidden. Your API key may not have permission for this model.`);
      } else if (response.status === 429) {
        throw new Error(`Rate limit exceeded. Please try again in a few moments.`);
      } else if (response.status >= 500) {
        throw new Error(`Gemini service is currently unavailable. Please try again later.`);
      }
      
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response status:', response.status);
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error('No text generated. Full response structure:', JSON.stringify(data, null, 2));
      
      // Check if the response was blocked by safety filters
      if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error('Content was blocked by safety filters. Please try rephrasing your prompt.');
      }
      
      // Provide a basic fallback description
      const fallbackDescription = `
This ${category || 'cultural heritage'} program offers participants the opportunity to learn traditional skills and techniques. 

Program Overview:
${prompt}

Duration: ${duration || 'To be determined'}
Location: ${location || 'To be determined'}

Participants will gain hands-on experience and learn from experienced artisans in a supportive learning environment. This program aims to preserve and pass on valuable cultural knowledge to the next generation.

Benefits:
- Learn traditional techniques
- Hands-on practical experience
- Cultural knowledge preservation
- Skill development
- Certificate of completion

Join us in this enriching journey to connect with our cultural heritage and develop valuable traditional skills.
      `.trim();
      
      return NextResponse.json({ 
        success: true, 
        generatedDescription: fallbackDescription,
        fallback: true
      });
    }

    return NextResponse.json({ 
      success: true, 
      generatedDescription: generatedText.trim() 
    });

  } catch (error) {
    console.error('Gemini AI Assistant error:', error);
    
    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key authentication failed')) {
        return NextResponse.json(
          { success: false, error: 'API key authentication failed. Please contact support.' },
          { status: 401 }
        );
      } else if (error.message.includes('API access forbidden')) {
        return NextResponse.json(
          { success: false, error: 'API access denied. Please contact support.' },
          { status: 403 }
        );
      } else if (error.message.includes('Rate limit exceeded')) {
        return NextResponse.json(
          { success: false, error: 'Too many requests. Please wait a moment and try again.' },
          { status: 429 }
        );
      } else if (error.message.includes('service is currently unavailable')) {
        return NextResponse.json(
          { success: false, error: 'AI service is temporarily unavailable. Please try again in a few minutes.' },
          { status: 503 }
        );
      } else if (error.message.includes('safety filters')) {
        return NextResponse.json(
          { success: false, error: 'Content was blocked by safety filters. Please try rephrasing your description.' },
          { status: 400 }
        );
      } else if (error.message.includes('Bad request')) {
        return NextResponse.json(
          { success: false, error: 'Invalid request format. Please try again with different input.' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { success: false, error: `AI generation failed: ${error.message}` },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while generating description' },
      { status: 500 }
    );
  }
}
