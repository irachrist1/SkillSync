"use client";

import { ArrowLeft, ArrowRight, Compass, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AssessmentQuestion } from "@/lib/types/assessment";

interface DiscoverAssessmentProps {
  started: boolean;
  isSubmitting: boolean;
  questions: AssessmentQuestion[];
  currentQuestionIndex: number;
  answers: Record<number, number>;
  onStart: () => void;
  onBack: () => void;
  onNext: () => void;
  onSelect: (questionId: number, value: number) => void;
  onSkip: () => void;
  error?: string | null;
}

function categoryLabel(index: number): string {
  if (index <= 11) return "Interests";
  if (index <= 17) return "Values";
  if (index <= 21) return "Personality";
  return "Environment";
}

export function DiscoverAssessment({
  started,
  isSubmitting,
  questions,
  currentQuestionIndex,
  answers,
  onStart,
  onBack,
  onNext,
  onSelect,
  onSkip,
  error,
}: DiscoverAssessmentProps) {
  if (!started) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Compass className="w-5 h-5 text-blue-700" />
              </div>
              <CardTitle>Discover your career interests</CardTitle>
            </div>
            <CardDescription>
              This short assessment uses RIASEC to understand what kinds of work you naturally enjoy: practical,
              analytical, creative, people-focused, business-focused, or structured work.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              You will answer 25 statements on a 5-point scale. Results combine your interests, values, personality,
              and work environment preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onStart} disabled={isSubmitting} className="sm:flex-1">
                Start Discover Assessment
              </Button>
              <Button variant="outline" onClick={onSkip} disabled={isSubmitting} className="sm:flex-1">
                <SkipForward className="w-4 h-4 mr-2" />
                Skip assessment
              </Button>
            </div>
          </CardContent>
        </Card>
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-red-700 text-sm">{error}</CardContent>
          </Card>
        )}
      </div>
    );
  }

  const question = questions[currentQuestionIndex];
  if (!question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-700 text-sm">Unable to load assessment question.</CardContent>
        </Card>
      </div>
    );
  }
  const selectedValue = answers[question.id];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const isLast = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur py-2">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-semibold text-gray-700">Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className="text-gray-500">{progress}% complete</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card className="transition-opacity duration-200">
        <CardHeader>
          <div className="mb-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1">
              {categoryLabel(currentQuestionIndex)}
            </span>
          </div>
          <CardTitle className="text-xl leading-relaxed">{question.text}</CardTitle>
          <CardDescription>Select one option that best reflects you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => onSelect(question.id, option.value)}
              className={`w-full text-left rounded-md border px-4 py-3 transition-colors ${
                selectedValue === option.value
                  ? "border-blue-600 bg-blue-50 text-blue-900"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-medium">{option.label}</div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting || currentQuestionIndex === 0}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button variant="outline" onClick={onSkip} disabled={isSubmitting}>
          <SkipForward className="w-4 h-4 mr-2" />
          Skip assessment
        </Button>
        <Button onClick={onNext} disabled={isSubmitting || selectedValue === undefined} className="ml-auto">
          {isLast ? "Finish and analyze" : "Next"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-700 text-sm">{error}</CardContent>
        </Card>
      )}
    </div>
  );
}
