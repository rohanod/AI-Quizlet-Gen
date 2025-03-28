"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { InstructionsModal } from "@/components/instructions-modal";

interface FlashcardDisplayProps {
  flashcards: { word: string; definition: string }[];
  isStreaming?: boolean;
}

export default function FlashcardDisplay({ flashcards, isStreaming = false }: FlashcardDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prevFlashcardCount, setPrevFlashcardCount] = useState(0);

  useEffect(() => {
    if (flashcards.length > prevFlashcardCount && containerRef.current) {
      setPrevFlashcardCount(flashcards.length);
      
      setTimeout(() => {
        if (containerRef.current) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [flashcards.length, prevFlashcardCount]);

  const formatForQuizlet = () => {
    return flashcards.map(card => `${card.word}\t${card.definition}`).join("\n");
  };

  const copyToClipboard = () => {
    const formattedText = formatForQuizlet();
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowInstructions(true);
  };

  const downloadAsTxt = () => {
    const formattedText = formatForQuizlet();
    const blob = new Blob([formattedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flashcards.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8 pb-32 w-full max-w-[2000px] mx-auto" ref={containerRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 w-full justify-center">
        <AnimatePresence initial={false}>
          {flashcards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[200px] bg-card rounded-xl border shadow-lg overflow-hidden flex flex-col"
            >
              <div className="bg-primary/10 p-3 flex items-center justify-center flex-[0.3]">
                <h3 className="text-xl font-semibold text-primary text-center">{card.word}</h3>
              </div>
              <div className="p-6 bg-card flex items-center justify-center flex-[0.7]">
                <p className="text-sm text-card-foreground text-center">{card.definition}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isStreaming && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-full h-[200px] rounded-xl bg-card/30 border shadow-lg flex items-center justify-center"
          >
            <div className="text-sm text-muted-foreground flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-primary/20 animate-ping"></div>
              Generating...
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="fixed bottom-8 left-0 right-0 mx-auto w-full max-w-xl bg-background/95 backdrop-blur-sm rounded-lg shadow-lg p-4 flex flex-col items-center gap-3">
        <div className="text-xs text-muted-foreground">
          Format: word\tdefinition\nword\tdefinition
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={downloadAsTxt} size="sm">
            Download as TXT
          </Button>
          <Button onClick={copyToClipboard} size="sm">
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </div>
      </div>
      
      <InstructionsModal 
        open={showInstructions} 
        onOpenChange={setShowInstructions} 
      />
    </div>
  );
}