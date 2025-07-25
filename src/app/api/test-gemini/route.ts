import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not found in environment variables'
      }, { status: 500 });
    }

    // Test with a simple prompt
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
                text: "Say hello in a friendly way."
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `API request failed: ${response.status} - ${errorText}`
      }, { status: response.status });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      success: true,
      message: 'Gemini API is working correctly',
      testResponse: generatedText,
      fullResponse: data
    });

  } catch (error) {
    console.error('Gemini test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
