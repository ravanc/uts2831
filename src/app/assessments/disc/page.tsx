'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { DISCTraits } from '@/types';

interface Question {
  id: string;
  text: string;
  trait: keyof DISCTraits;
}

const questions: Question[] = [
  // Dominance (6 questions)
  { id: 'd1', text: 'I am direct and assertive in my communication', trait: 'dominance' },
  { id: 'd2', text: 'I enjoy taking charge and making decisions', trait: 'dominance' },
  { id: 'd3', text: 'I am competitive and results-oriented', trait: 'dominance' },
  { id: 'd4', text: 'I challenge the status quo and take risks', trait: 'dominance' },
  { id: 'd5', text: 'I prefer to lead rather than follow', trait: 'dominance' },
  { id: 'd6', text: 'I am comfortable with confrontation when necessary', trait: 'dominance' },

  // Influence (6 questions)
  { id: 'i1', text: 'I am enthusiastic and outgoing', trait: 'influence' },
  { id: 'i2', text: 'I enjoy collaborating and working with others', trait: 'influence' },
  { id: 'i3', text: 'I am persuasive and can inspire people', trait: 'influence' },
  { id: 'i4', text: 'I prefer verbal communication over written', trait: 'influence' },
  { id: 'i5', text: 'I am optimistic and see the positive side', trait: 'influence' },
  { id: 'i6', text: 'I build relationships easily', trait: 'influence' },

  // Steadiness (6 questions)
  { id: 's1', text: 'I am patient and calm under pressure', trait: 'steadiness' },
  { id: 's2', text: 'I prefer stability and predictable routines', trait: 'steadiness' },
  { id: 's3', text: 'I am a good listener and supportive team member', trait: 'steadiness' },
  { id: 's4', text: 'I avoid conflict and seek harmony', trait: 'steadiness' },
  { id: 's5', text: 'I am loyal and dependable', trait: 'steadiness' },
  { id: 's6', text: 'I take time to make decisions carefully', trait: 'steadiness' },

  // Conscientiousness (6 questions)
  { id: 'c1', text: 'I pay close attention to details and accuracy', trait: 'conscientiousness' },
  { id: 'c2', text: 'I follow rules, procedures, and standards', trait: 'conscientiousness' },
  { id: 'c3', text: 'I analyze data before making decisions', trait: 'conscientiousness' },
  { id: 'c4', text: 'I value quality over speed', trait: 'conscientiousness' },
  { id: 'c5', text: 'I am systematic and organized in my approach', trait: 'conscientiousness' },
  { id: 'c6', text: 'I ask questions to ensure understanding', trait: 'conscientiousness' },
];

const scaleOptions = [
  { value: '1', label: 'Strongly Disagree' },
  { value: '2', label: 'Disagree' },
  { value: '3', label: 'Neutral' },
  { value: '4', label: 'Agree' },
  { value: '5', label: 'Strongly Agree' },
];

const discDescriptions = {
  dominance: {
    title: 'Dominance',
    description: 'How you approach problems and challenges',
    high: 'Direct, decisive, and results-oriented. You tackle challenges head-on.',
    low: 'Thoughtful and collaborative. You prefer cooperation over competition.',
  },
  influence: {
    title: 'Influence',
    description: 'How you interact with and influence others',
    high: 'Enthusiastic, persuasive, and people-oriented. You inspire and motivate others.',
    low: 'Reserved and task-focused. You prefer facts over emotions in communication.',
  },
  steadiness: {
    title: 'Steadiness',
    description: 'How you respond to pace and change',
    high: 'Patient, calm, and supportive. You value stability and consistency.',
    low: 'Dynamic and flexible. You thrive on variety and change.',
  },
  conscientiousness: {
    title: 'Conscientiousness',
    description: 'How you approach rules and procedures',
    high: 'Analytical, precise, and quality-focused. You value accuracy and standards.',
    low: 'Independent and flexible. You focus on the big picture over details.',
  },
};

export default function DISCAssessmentPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);

  const questionsPerPage = 6;
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

  const calculateResults = (): DISCTraits => {
    const traitScores: Record<keyof DISCTraits, number[]> = {
      dominance: [],
      influence: [],
      steadiness: [],
      conscientiousness: [],
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      traitScores[question.trait].push(answer);
    });

    const results: DISCTraits = {
      dominance: 0,
      influence: 0,
      steadiness: 0,
      conscientiousness: 0,
    };

    Object.keys(traitScores).forEach(trait => {
      const scores = traitScores[trait as keyof DISCTraits];
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      // Convert from 1-5 scale to 0-100 scale
      results[trait as keyof DISCTraits] = Math.round(((average - 1) / 4) * 100);
    });

    return results;
  };

  const handleSubmit = () => {
    const results = calculateResults();

    // Get current profile from localStorage
    const storedProfile = localStorage.getItem('userPersonalityProfile');
    const currentProfile = storedProfile ? JSON.parse(storedProfile) : {};

    // Update with new DISC results
    const updatedProfile = {
      ...currentProfile,
      disc: results,
      lastAssessedDISC: new Date().toISOString(),
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
    const dominant = Object.entries(results).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as keyof DISCTraits;

    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>
              Your DISC work style profile has been updated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">Primary Style: {discDescriptions[dominant].title}</h3>
              <p className="text-muted-foreground">{discDescriptions[dominant].description}</p>
            </div>

            <div className="space-y-4">
              {(Object.keys(results) as Array<keyof DISCTraits>).map((trait) => {
                const score = results[trait];
                const info = discDescriptions[trait];
                return (
                  <div key={trait} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{info.title}</span>
                      <span className="text-muted-foreground">{score}/100</span>
                    </div>
                    <Progress value={score} />
                    <p className="text-sm text-muted-foreground">
                      {score >= 60 ? info.high : info.low}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Your DISC Profile</h4>
              <p className="text-sm text-muted-foreground">
                D: {results.dominance} | I: {results.influence} | S: {results.steadiness} | C: {results.conscientiousness}
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => router.push('/profile')} className="flex-1">
                View Profile
              </Button>
              <Button onClick={() => router.push('/jobs')} variant="outline" className="flex-1">
                Browse Jobs
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
          <h1 className="text-3xl font-bold mb-2">DISC Work Style Assessment</h1>
          <p className="text-muted-foreground">
            Discover your work style across four dimensions: Dominance, Influence, Steadiness, and Conscientiousness.
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
            <CardDescription>
              Currently assessing: {discDescriptions[currentQuestions[0].trait].title}
            </CardDescription>
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
