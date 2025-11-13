'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { BigFiveTraits } from '@/types';

interface Question {
  id: string;
  text: string;
  trait: keyof BigFiveTraits;
  reverse?: boolean; // If true, scoring is reversed
}

const questions: Question[] = [
  // Openness (6 questions)
  { id: 'o1', text: 'I enjoy trying new and unfamiliar things', trait: 'openness' },
  { id: 'o2', text: 'I have a vivid imagination', trait: 'openness' },
  { id: 'o3', text: 'I appreciate art and beauty', trait: 'openness' },
  { id: 'o4', text: 'I prefer routine over variety', trait: 'openness', reverse: true },
  { id: 'o5', text: 'I am curious about many different things', trait: 'openness' },
  { id: 'o6', text: 'I enjoy philosophical discussions', trait: 'openness' },

  // Conscientiousness (6 questions)
  { id: 'c1', text: 'I am always prepared and organized', trait: 'conscientiousness' },
  { id: 'c2', text: 'I pay attention to details', trait: 'conscientiousness' },
  { id: 'c3', text: 'I often leave tasks until the last minute', trait: 'conscientiousness', reverse: true },
  { id: 'c4', text: 'I make plans and stick to them', trait: 'conscientiousness' },
  { id: 'c5', text: 'I work hard to achieve my goals', trait: 'conscientiousness' },
  { id: 'c6', text: 'I am easily distracted', trait: 'conscientiousness', reverse: true },

  // Extraversion (6 questions)
  { id: 'e1', text: 'I feel energized when around other people', trait: 'extraversion' },
  { id: 'e2', text: 'I enjoy being the center of attention', trait: 'extraversion' },
  { id: 'e3', text: 'I prefer to keep to myself', trait: 'extraversion', reverse: true },
  { id: 'e4', text: 'I start conversations with strangers easily', trait: 'extraversion' },
  { id: 'e5', text: 'I feel comfortable in large social gatherings', trait: 'extraversion' },
  { id: 'e6', text: 'I need time alone to recharge', trait: 'extraversion', reverse: true },

  // Agreeableness (6 questions)
  { id: 'a1', text: 'I am considerate and kind to others', trait: 'agreeableness' },
  { id: 'a2', text: 'I trust people easily', trait: 'agreeableness' },
  { id: 'a3', text: 'I often criticize others', trait: 'agreeableness', reverse: true },
  { id: 'a4', text: 'I try to help others when I can', trait: 'agreeableness' },
  { id: 'a5', text: 'I value cooperation over competition', trait: 'agreeableness' },
  { id: 'a6', text: 'I am skeptical of others\' intentions', trait: 'agreeableness', reverse: true },

  // Neuroticism (6 questions)
  { id: 'n1', text: 'I often feel stressed or anxious', trait: 'neuroticism' },
  { id: 'n2', text: 'My mood changes frequently', trait: 'neuroticism' },
  { id: 'n3', text: 'I stay calm under pressure', trait: 'neuroticism', reverse: true },
  { id: 'n4', text: 'I worry about things that might go wrong', trait: 'neuroticism' },
  { id: 'n5', text: 'I am emotionally stable', trait: 'neuroticism', reverse: true },
  { id: 'n6', text: 'I get irritated easily', trait: 'neuroticism' },
];

const scaleOptions = [
  { value: '1', label: 'Strongly Disagree' },
  { value: '2', label: 'Disagree' },
  { value: '3', label: 'Neutral' },
  { value: '4', label: 'Agree' },
  { value: '5', label: 'Strongly Agree' },
];

export default function BigFiveAssessmentPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const progress = (Object.keys(answers).length / questions.length) * 100;

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value),
    }));
  };

  const canGoNext = currentQuestions.every(q => answers[q.id] !== undefined);

  const calculateResults = (): BigFiveTraits => {
    const traitScores: Record<keyof BigFiveTraits, number[]> = {
      openness: [],
      conscientiousness: [],
      extraversion: [],
      agreeableness: [],
      neuroticism: [],
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      const score = question.reverse ? (6 - answer) : answer;
      traitScores[question.trait].push(score);
    });

    const results: BigFiveTraits = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    };

    Object.keys(traitScores).forEach(trait => {
      const scores = traitScores[trait as keyof BigFiveTraits];
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      // Convert from 1-5 scale to 0-100 scale
      results[trait as keyof BigFiveTraits] = Math.round(((average - 1) / 4) * 100);
    });

    return results;
  };

  const handleSubmit = () => {
    const results = calculateResults();

    // Get current profile from localStorage or use default
    const storedProfile = localStorage.getItem('userPersonalityProfile');
    const currentProfile = storedProfile ? JSON.parse(storedProfile) : {};

    // Update with new Big Five results
    const updatedProfile = {
      ...currentProfile,
      bigFive: results,
      lastAssessedBigFive: new Date().toISOString(),
    };

    localStorage.setItem('userPersonalityProfile', JSON.stringify(updatedProfile));
    setIsComplete(true);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (canGoNext) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isComplete) {
    const results = calculateResults();
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>
              Your Big Five personality profile has been updated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Openness</span>
                  <span className="text-muted-foreground">{results.openness}/100</span>
                </div>
                <Progress value={results.openness} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Conscientiousness</span>
                  <span className="text-muted-foreground">{results.conscientiousness}/100</span>
                </div>
                <Progress value={results.conscientiousness} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Extraversion</span>
                  <span className="text-muted-foreground">{results.extraversion}/100</span>
                </div>
                <Progress value={results.extraversion} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Agreeableness</span>
                  <span className="text-muted-foreground">{results.agreeableness}/100</span>
                </div>
                <Progress value={results.agreeableness} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Neuroticism</span>
                  <span className="text-muted-foreground">{results.neuroticism}/100</span>
                </div>
                <Progress value={results.neuroticism} />
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => router.push('/profile')} className="flex-1">
                View Profile
              </Button>
              <Button onClick={() => router.push('/assessments/mbti')} variant="outline" className="flex-1">
                Take MBTI Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Big Five Personality Assessment</h1>
          <p className="text-muted-foreground">
            Answer honestly about how you typically think, feel, and behave. There are no right or wrong answers.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Questions {currentPage * questionsPerPage + 1} - {Math.min((currentPage + 1) * questionsPerPage, questions.length)} of {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {currentQuestions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-medium">
                  {currentPage * questionsPerPage + index + 1}. {question.text}
                </Label>
                <RadioGroup
                  value={answers[question.id]?.toString()}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    {scaleOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                        <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer flex-1 text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentPage === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canGoNext}
          >
            {currentPage === totalPages - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
