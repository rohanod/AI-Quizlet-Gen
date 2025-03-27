"use client";

import { useState, useEffect } from "react";
import { experimental_useObject } from "@ai-sdk/react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/theme-toggle";
import FlashcardDisplay from "@/components/flashcard-display";

// Dynamic import with ssr: false to avoid hydration mismatch
const FlashcardForm = dynamic(
  () => import("@/components/flashcard-form"),
  { ssr: false }
);

// Define the flashcard type
type Flashcard = {
  word: string;
  definition: string;
};

export default function FlashcardGenerator() {
  const [topic, setTopic] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [numFlashcards, setNumFlashcards] = useState(10);
  const [gradeLevel, setGradeLevel] = useState("middle");

  // Load API key from localStorage on client-side
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedApiKey = window.localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (apiKey) {
      window.localStorage.setItem('geminiApiKey', apiKey);
    }
  }, [apiKey]);

  const {
    submit,
    object: partialResult,
    isLoading,
    stop,
  } = experimental_useObject({
    api: "/api/generate-flashcards",
    schema: z.object({
      flashcards: z.array(
        z.object({
          word: z.string(),
          definition: z.string()
        })
      )
    }),
    initialValue: { flashcards: [] },
    onError: (error) => {
      console.error("Error generating flashcards:", error);
      toast.error("Failed to generate flashcards. Please try again.");
    },
    onFinish: (result) => {
      console.log("Finished with final object:", result);
      if (result.object?.flashcards) {
        toast.success(`Generated ${result.object.flashcards.length} flashcards successfully!`);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) {
      toast.error("Please enter a topic");
      return;
    }
    if (!apiKey) {
      toast.error("Please enter your Gemini API key");
      return;
    }
    console.log("Submitting request for topic:", topic);
    submit({ topic, apiKey, numFlashcards, gradeLevel });
  };

  // Safely convert partial objects to complete flashcards
  const safeFlashcards: Flashcard[] = partialResult?.flashcards 
    ? partialResult.flashcards
        .filter((card): card is Flashcard => 
          card !== undefined && 
          typeof card.word === 'string' && 
          typeof card.definition === 'string'
        )
    : []

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto px-4 md:px-8">
        <div className="w-full bg-background/50 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">
              AI Flashcard Generator
            </h1>
            <div className="flex items-center gap-2">
              {isLoading && (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              )}
              <ThemeToggle />
            </div>
          </div>
          
          <FlashcardForm
            topic={topic}
            setTopic={setTopic}
            apiKey={apiKey}
            setApiKey={setApiKey}
            numFlashcards={numFlashcards}
            setNumFlashcards={setNumFlashcards}
            gradeLevel={gradeLevel}
            setGradeLevel={setGradeLevel}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onStop={stop}
          />
        </div>
      </div>

      {partialResult?.flashcards ? (
        <div className="w-full px-4 md:px-8">
          <div className="mt-8 text-center text-sm text-muted-foreground mb-8">
            Generated {safeFlashcards.length} flashcards{isLoading ? " (streaming...)" : ""}
          </div>
          <FlashcardDisplay flashcards={safeFlashcards} isStreaming={isLoading} />
        </div>
      ) : isLoading ? (
        <div className="mt-8 animate-pulse rounded-lg bg-muted/50 p-12 text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Generating flashcards...</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
