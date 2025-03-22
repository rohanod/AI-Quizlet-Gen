import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from "zod";
import { logger } from "@/lib/logger";

export const maxDuration = 60;

const flashcardSchema = z.object({
  flashcards: z.array(
    z.object({
      word: z.string(),
      definition: z.string()
    })
  )
});

export async function POST(req: Request) {
  logger.info("API route called: generate-flashcards");
  
  try {
    const { topic, apiKey, numFlashcards = 10, gradeLevel = "middle" } = await req.json();
    logger.info("Request received for topic", { topic, numFlashcards, gradeLevel });

    const cardCount = Math.min(Math.max(1, Number(numFlashcards)), 30);
    
    logger.debug("Initializing Gemini model with search grounding");
    
    const google = createGoogleGenerativeAI({
      apiKey: apiKey
    });
    
    const gradeLevelInstructions = getGradeLevelInstructions(gradeLevel);
    
    const prompt = `Generate ${cardCount} clear, concise flashcards about ${topic}. Use the most up-to-date information available.

${gradeLevelInstructions}

IMPORTANT: Do NOT enumerate or number the flashcards in your response. Return the data in the requested JSON format.

Each flashcard should contain:
- A term or concept as the "word" field
- A concise 1-2 sentence explanation as the "definition" field`;

    const result = streamObject({
      model: google('gemini-2.0-flash-001', {
        useSearchGrounding: true,
      }),
      prompt: prompt,
      schema: flashcardSchema,
    });
    
    logger.info("Streaming flashcards generation started");
    return result.toTextStreamResponse();

  } catch (error) {
    logger.error("Error generating flashcards", { error });
    return new Response(JSON.stringify({ error: "Failed to generate flashcards" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

function getGradeLevelInstructions(gradeLevel: string): string {
  switch (gradeLevel) {
    case "elementary":
      return "Target these flashcards for elementary school students (grades 1-5). Use simple language, short sentences, and basic concepts. Definitions should be easy to understand with common vocabulary.";
    case "middle":
      return "Target these flashcards for middle school students (grades 6-8). Use clear language with some subject-specific vocabulary, but explain any complex terms. Definitions should be straightforward but can introduce more nuanced concepts.";
    case "highschool":
      return "Target these flashcards for high school students (grades 9-12). Use appropriate academic language and subject-specific terminology. Definitions can include more complex concepts and relationships between ideas.";
    case "college":
      return "Target these flashcards for college-level students. Use precise academic language and discipline-specific terminology. Definitions should be comprehensive and can include theoretical frameworks and advanced concepts.";
    case "advanced":
      return "Target these flashcards for advanced or professional-level users. Use specialized terminology, technical language, and sophisticated concepts. Definitions can include detailed explanations of complex topics and references to current research or advanced applications.";
    default:
      return "Target these flashcards for middle school students (grades 6-8). Use clear language with some subject-specific vocabulary, but explain any complex terms.";
  }
}