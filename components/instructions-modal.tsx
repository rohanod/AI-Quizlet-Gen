"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface InstructionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstructionsModal({ open, onOpenChange }: InstructionsModalProps) {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const handleImageClick = (imagePath: string) => {
    setEnlargedImage(imagePath);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">How to Import Flashcards in Quizlet</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Follow these steps to import your flashcards into Quizlet
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <section>
              <h3 className="text-lg font-medium mb-2">Create the course (Or choose an existing deck)</h3>
              <ol className="list-decimal pl-5 space-y-3">
                <li className="text-sm">Go to the Quizlet page</li>
                <li className="text-sm">
                  Click on the "+" button near the top right
                  <div className="mt-2">
                    <Image 
                      src="/instructions/1.jpeg" 
                      alt="Plus button near top right" 
                      width={650} 
                      height={430} 
                      className="rounded-md border hover:opacity-90 transition-opacity cursor-pointer"
                      onClick={() => handleImageClick("/public/instructions/1.jpeg")}
                    />
                  </div>
                </li>
                <li className="text-sm">
                  Click "Flashcard set"
                  <div className="mt-2">
                    <Image 
                      src="/instructions/2.jpeg" 
                      alt="Flashcard set button" 
                      width={650} 
                      height={430} 
                      className="rounded-md border hover:opacity-90 transition-opacity cursor-pointer"
                      onClick={() => handleImageClick("/public/instructions/2.jpeg")}
                    />
                  </div>
                </li>
              </ol>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-2">Import the flashcards</h3>
              <ol className="list-decimal pl-5 space-y-3">
                <li className="text-sm">
                  Click the "+ Import" button
                  <div className="mt-2">
                    <Image 
                      src="/instructions/3.jpeg" 
                      alt="Import button" 
                      width={650} 
                      height={430} 
                      className="rounded-md border hover:opacity-90 transition-opacity cursor-pointer"
                      onClick={() => handleImageClick("/public/instructions/3.jpeg")}
                    />
                  </div>
                </li>
                <li className="text-sm">
                  Paste the info copied from this site into the large text box
                  <div className="mt-2">
                    <Image 
                      src="/instructions/4.jpeg" 
                      alt="Import text box" 
                      width={650} 
                      height={430} 
                      className="rounded-md border hover:opacity-90 transition-opacity cursor-pointer"
                      onClick={() => handleImageClick("/public/instructions/4.jpeg")}
                    />
                  </div>
                </li>
                <li className="text-sm">
                  Make sure "Between Term and Definition" is set to <strong>Tab</strong> and "Between cards" is set to <strong>New line</strong>
                  <div className="mt-2">
                    <Image 
                      src="/instructions/5.jpeg" 
                      alt="Import settings" 
                      width={650} 
                      height={430} 
                      className="rounded-md border hover:opacity-90 transition-opacity cursor-pointer"
                      onClick={() => handleImageClick("/public/instructions/5.jpeg")}
                    />
                  </div>
                </li>
                <li className="text-sm">
                  Click "Import" at the bottom right
                  <div className="mt-2">
                    <Image 
                      src="/instructions/6.jpeg" 
                      alt="Import button" 
                      width={650} 
                      height={430} 
                      className="rounded-md border hover:opacity-90 transition-opacity cursor-pointer"
                      onClick={() => handleImageClick("/public/instructions/6.jpeg")}
                    />
                  </div>
                </li>
              </ol>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Enlargement Dialog */}
      {enlargedImage && (
        <Dialog open={!!enlargedImage} onOpenChange={() => setEnlargedImage(null)}>
          <DialogContent className="max-w-7xl p-0 overflow-hidden bg-transparent border-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Enlarged Image View</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={enlargedImage.replace("/public", "")}
                alt="Enlarged instruction image"
                width={1500}
                height={1200}
                className="rounded-md max-h-[90vh] w-auto object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}