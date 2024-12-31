import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.chord || typeof body.chord !== 'string') {
      return NextResponse.json(
        { error: 'Chord name is required and must be a string' },
        { status: 400 }
      );
    }

    const { chord } = body;
    console.log('Chord:', chord);

    const prompt = `Generate a guitar chord diagram for ${chord}. 
    Return only a JSON object with the following structure:
    {
      "name": "chord name",
      "positions": [array of 6 numbers representing fret positions for each string, use -1 for muted strings],
      "fingering": [array of 6 numbers representing which finger to use (1-4, 0 for open string)]
    }
    Example for Am:
    {
      "name": "Am",
      "positions": [0, 1, 2, 2, 0, 0],
      "fingering": [0, 1, 2, 3, 0, 0]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      temperature: 0.1,
      max_tokens: 150,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    console.log('AI response:', response);

    const chordData = JSON.parse(response);

    if (!chordData.name || 
        !Array.isArray(chordData.positions) || 
        !Array.isArray(chordData.fingering) ||
        chordData.positions.length !== 6 ||
        chordData.fingering.length !== 6) {
      console.error('Invalid chord data:', chordData);
      throw new Error('Invalid chord data format');
    }

    return NextResponse.json({ chord: chordData });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}