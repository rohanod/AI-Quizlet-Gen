"use client"

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface GradeLevelSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export default function GradeLevelSelect({ value, onValueChange }: GradeLevelSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
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
  )
} 