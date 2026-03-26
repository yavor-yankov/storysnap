"use client"

import { Check } from "lucide-react"

interface Step {
  number: number
  label: string
  active: boolean
  completed: boolean
}

interface CreationStepperProps {
  currentStep: number
}

const steps = [
  { label: "Upload Portrait" },
  { label: "Choose Style" },
  { label: "Generate" },
  { label: "Preview" },
]

export function CreationStepper({ currentStep }: CreationStepperProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          const stepNum = index + 1
          const isActive = stepNum === currentStep
          const isCompleted = stepNum < currentStep

          return (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isCompleted
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-950/30"
                      : isActive
                      ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-950/30 ring-4 ring-purple-200 dark:ring-purple-900"
                      : "bg-muted text-muted-foreground border-2 border-border"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mb-5 mx-2 transition-all ${
                    stepNum < currentStep
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                      : "bg-border"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
