"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FlashcardFormProps {
  topic: string
  setTopic: (topic: string) => void
  apiKey: string
  setApiKey: (apiKey: string) => void
  numFlashcards: number
  setNumFlashcards: (num: number) => void
  gradeLevel: string
  setGradeLevel: (level: string) => void
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onStop?: () => void
}

export default function FlashcardForm({
  topic,
  setTopic,
  apiKey,
  setApiKey,
  numFlashcards,
  setNumFlashcards,
  gradeLevel,
  setGradeLevel,
  isLoading,
  onSubmit,
  onStop
}: FlashcardFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="apiKey">Gemini API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="focus-visible:ring-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., 'World War II', 'Photosynthesis')"
          className="focus-visible:ring-primary"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numFlashcards">Number of Flashcards</Label>
          <Input
            id="numFlashcards"
            type="number"
            min="1"
            max="30"
            value={numFlashcards}
            onChange={(e) => setNumFlashcards(parseInt(e.target.value) || 10)}
            className="focus-visible:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gradeLevel">Grade Level</Label>
          <Select
            value={gradeLevel}
            onValueChange={setGradeLevel}
          >
            <SelectTrigger id="gradeLevel" className="focus-visible:ring-primary">
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elementary">Elementary School (Grades 1-5)</SelectItem>
              <SelectItem value="middle">Middle School (Grades 6-8)</SelectItem>
              <SelectItem value="highschool">High School (Grades 9-12)</SelectItem>
              <SelectItem value="college">College Level</SelectItem>
              <SelectItem value="advanced">Advanced/Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isLoading} className="flex-1 py-6">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Flashcards"
          )}
        </Button>
        {isLoading && onStop && (
          <Button type="button" variant="outline" onClick={onStop} className="py-6">
            Stop
          </Button>
        )}
      </div>
    </form>
  )
} 