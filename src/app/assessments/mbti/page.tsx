'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { MBTITraits, MBTIType } from '@/types';

interface Question {
  id: string;
  text: string;
  dimension: 'IE' | 'SN' | 'TF' | 'JP';
  direction: 'first' | 'second'; // first = I/S/T/J, second = E/N/F/P
}

const questions: Question[] = [
  // Introversion vs Extraversion (8 questions)
  { id: 'ie1', text: 'I prefer spending time alone or with close friends', dimension: 'IE', direction: 'first' },
  { id: 'ie2', text: 'I feel energized by social events and meeting new people', dimension: 'IE', direction: 'second' },
  { id: 'ie3', text: 'I think things through before speaking', dimension: 'IE', direction: 'first' },
  { id: 'ie4', text: 'I enjoy being the center of attention', dimension: 'IE', direction: 'second' },
  { id: 'ie5', text: 'I prefer written communication over verbal', dimension: 'IE', direction: 'first' },
  { id: 'ie6', text: 'I make friends easily in new situations', dimension: 'IE', direction: 'second' },
  { id: 'ie7', text: 'I need quiet time to recharge', dimension: 'IE', direction: 'first' },
  { id: 'ie8', text: 'I often speak before thinking', dimension: 'IE', direction: 'second' },

  // Sensing vs Intuition (8 questions)
  { id: 'sn1', text: 'I focus on facts and details', dimension: 'SN', direction: 'first' },
  { id: 'sn2', text: 'I enjoy theoretical and abstract concepts', dimension: 'SN', direction: 'second' },
  { id: 'sn3', text: 'I prefer practical, hands-on learning', dimension: 'SN', direction: 'first' },
  { id: 'sn4', text: 'I often think about future possibilities', dimension: 'SN', direction: 'second' },
  { id: 'sn5', text: 'I trust established methods and procedures', dimension: 'SN', direction: 'first' },
  { id: 'sn6', text: 'I enjoy exploring new ideas and innovations', dimension: 'SN', direction: 'second' },
  { id: 'sn7', text: 'I pay attention to sensory details in my environment', dimension: 'SN', direction: 'first' },
  { id: 'sn8', text: 'I see patterns and connections easily', dimension: 'SN', direction: 'second' },

  // Thinking vs Feeling (8 questions)
  { id: 'tf1', text: 'I make decisions based on logic and analysis', dimension: 'TF', direction: 'first' },
  { id: 'tf2', text: 'I consider people\'s feelings when making decisions', dimension: 'TF', direction: 'second' },
  { id: 'tf3', text: 'I value truth over tact', dimension: 'TF', direction: 'first' },
  { id: 'tf4', text: 'I try to maintain harmony in relationships', dimension: 'TF', direction: 'second' },
  { id: 'tf5', text: 'I prefer objective criticism over emotional support', dimension: 'TF', direction: 'first' },
  { id: 'tf6', text: 'I can easily sense others\' emotions', dimension: 'TF', direction: 'second' },
  { id: 'tf7', text: 'I value fairness and consistency', dimension: 'TF', direction: 'first' },
  { id: 'tf8', text: 'I make exceptions based on individual circumstances', dimension: 'TF', direction: 'second' },

  // Judging vs Perceiving (8 questions)
  { id: 'jp1', text: 'I like to plan ahead and stick to schedules', dimension: 'JP', direction: 'first' },
  { id: 'jp2', text: 'I prefer to keep my options open', dimension: 'JP', direction: 'second' },
  { id: 'jp3', text: 'I feel satisfied when tasks are completed', dimension: 'JP', direction: 'first' },
  { id: 'jp4', text: 'I work better close to deadlines', dimension: 'JP', direction: 'second' },
  { id: 'jp5', text: 'I like clear structure and organization', dimension: 'JP', direction: 'first' },
  { id: 'jp6', text: 'I adapt easily to changes in plans', dimension: 'JP', direction: 'second' },
  { id: 'jp7', text: 'I prefer to make decisions quickly', dimension: 'JP', direction: 'first' },
  { id: 'jp8', text: 'I enjoy exploring multiple alternatives', dimension: 'JP', direction: 'second' },
];

const scaleOptions = [
  { value: '1', label: 'Strongly Disagree' },
  { value: '2', label: 'Disagree' },
  { value: '3', label: 'Neutral' },
  { value: '4', label: 'Agree' },
  { value: '5', label: 'Strongly Agree' },
];

const mbtiDescriptions: Record<MBTIType, { title: string; description: string }> = {
  'INTJ': { title: 'The Architect', description: 'Strategic, analytical, and independent thinkers with high standards' },
  'INTP': { title: 'The Logician', description: 'Innovative inventors with an endless thirst for knowledge' },
  'ENTJ': { title: 'The Commander', description: 'Bold, imaginative, and strong-willed leaders' },
  'ENTP': { title: 'The Debater', description: 'Smart and curious thinkers who love intellectual challenges' },
  'INFJ': { title: 'The Advocate', description: 'Quiet and mystical, yet inspiring idealists' },
  'INFP': { title: 'The Mediator', description: 'Poetic, kind, and altruistic, always eager to help' },
  'ENFJ': { title: 'The Protagonist', description: 'Charismatic and inspiring leaders who are passionate about helping others' },
  'ENFP': { title: 'The Campaigner', description: 'Enthusiastic, creative, and sociable free spirits' },
  'ISTJ': { title: 'The Logistician', description: 'Practical and fact-minded individuals who value reliability' },
  'ISFJ': { title: 'The Defender', description: 'Dedicated and warm protectors who are always ready to defend loved ones' },
  'ESTJ': { title: 'The Executive', description: 'Excellent administrators who manage situations with efficiency' },
  'ESFJ': { title: 'The Consul', description: 'Caring and social, always eager to help others' },
  'ISTP': { title: 'The Virtuoso', description: 'Bold and practical experimenters who master tools' },
  'ISFP': { title: 'The Adventurer', description: 'Flexible and charming artists ready to explore new things' },
  'ESTP': { title: 'The Entrepreneur', description: 'Smart, energetic, and perceptive, who truly enjoy living on the edge' },
  'ESFP': { title: 'The Entertainer', description: 'Spontaneous, energetic, and enthusiastic entertainers' },
};

export default function MBTIAssessmentPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);

  const questionsPerPage = 4;
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

  const calculateResults = (): MBTITraits => {
    const dimensionScores = {
      IE: 0, // Negative for I, positive for E
      SN: 0, // Negative for S, positive for N
      TF: 0, // Negative for T, positive for F
      JP: 0, // Negative for J, positive for P
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      const score = answer - 3; // Convert 1-5 to -2 to 2
      const adjustedScore = question.direction === 'first' ? -score : score;
      dimensionScores[question.dimension] += adjustedScore;
    });

    // Determine MBTI type
    const type: MBTIType =
      `${dimensionScores.IE >= 0 ? 'E' : 'I'}${dimensionScores.SN >= 0 ? 'N' : 'S'}${dimensionScores.TF >= 0 ? 'F' : 'T'}${dimensionScores.JP >= 0 ? 'P' : 'J'}` as MBTIType;

    // Convert to 0-100 scale (50 is neutral)
    const maxScore = 8 * 2; // 8 questions per dimension * 2 max score per question
    const results: MBTITraits = {
      type,
      introversion_extraversion: Math.round(((dimensionScores.IE / maxScore) + 1) * 50),
      intuition_sensing: Math.round(((dimensionScores.SN / maxScore) + 1) * 50),
      thinking_feeling: Math.round(((dimensionScores.TF / maxScore) + 1) * 50),
      judging_perceiving: Math.round(((dimensionScores.JP / maxScore) + 1) * 50),
    };

    return results;
  };

  const handleSubmit = () => {
    const results = calculateResults();

    // Get current profile from localStorage
    const storedProfile = localStorage.getItem('userPersonalityProfile');
    const currentProfile = storedProfile ? JSON.parse(storedProfile) : {};

    // Update with new MBTI results
    const updatedProfile = {
      ...currentProfile,
      mbti: results,
      lastAssessedMBTI: new Date().toISOString(),
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
    const typeInfo = mbtiDescriptions[results.type];

    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>
              Your MBTI personality type has been determined
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <h3 className="text-4xl font-bold mb-2">{results.type}</h3>
              <p className="text-xl font-medium mb-1">{typeInfo.title}</p>
              <p className="text-muted-foreground">{typeInfo.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Introversion</span>
                  <span className="font-medium">{results.type[0]}</span>
                  <span>Extraversion</span>
                </div>
                <Progress value={results.introversion_extraversion} />
                <div className="text-center text-sm text-muted-foreground mt-1">
                  {results.introversion_extraversion}%
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Sensing</span>
                  <span className="font-medium">{results.type[1]}</span>
                  <span>Intuition</span>
                </div>
                <Progress value={results.intuition_sensing} />
                <div className="text-center text-sm text-muted-foreground mt-1">
                  {results.intuition_sensing}%
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Thinking</span>
                  <span className="font-medium">{results.type[2]}</span>
                  <span>Feeling</span>
                </div>
                <Progress value={results.thinking_feeling} />
                <div className="text-center text-sm text-muted-foreground mt-1">
                  {results.thinking_feeling}%
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Judging</span>
                  <span className="font-medium">{results.type[3]}</span>
                  <span>Perceiving</span>
                </div>
                <Progress value={results.judging_perceiving} />
                <div className="text-center text-sm text-muted-foreground mt-1">
                  {results.judging_perceiving}%
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => router.push('/profile')} className="flex-1">
                View Profile
              </Button>
              <Button onClick={() => router.push('/assessments/disc')} variant="outline" className="flex-1">
                Take DISC Test
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
          <h1 className="text-3xl font-bold mb-2">MBTI Personality Assessment</h1>
          <p className="text-muted-foreground">
            Discover your personality type across four dimensions: Introversion/Extraversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving.
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
