import React, { useState, useEffect } from 'react';
import { Button, Card, Heading, Text, Callout, Badge, Flex } from '@radix-ui/themes';
import Breadcrumbs from '../../components/Breadcrumb';
import { IoHomeOutline, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';
import { InfoCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';

function Comprehension() {
  const { state } = useLocation();
  const exercisedata = state?.exercisedata;
  const readingSpeed = state?.readingSpeed;
  const questions = exercisedata?.content?.mcqs;

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [percentageCorrect, setPercentageCorrect] = useState(0);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [answersChecked, setAnswersChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    if (answersChecked) return;
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: { answer: selectedOption, correct: null },
    }));
  };

  useEffect(() => {
    const answeredQuestions = Object.keys(selectedAnswers);
    setAllQuestionsAnswered(answeredQuestions?.length === questions?.length);
  }, [selectedAnswers, questions]);

  const handleCheckAnswers = () => {
    if (!allQuestionsAnswered) {
      return;
    }
    
    const correctAnswers = questions.map((question) => question.correctAnswer);
    const numQuestions = questions?.length;
    let numCorrect = 0;

    for (let i = 0; i < numQuestions; i++) {
      const correctAnswer = correctAnswers[i];
      const selectedAnswer = selectedAnswers[i]?.answer;

      if (correctAnswer === selectedAnswer) {
        numCorrect++;
        setSelectedAnswers((prevAnswers) => ({
          ...prevAnswers,
          [i]: { ...prevAnswers[i], correct: true },
        }));
      } else {
        setSelectedAnswers((prevAnswers) => ({
          ...prevAnswers,
          [i]: { ...prevAnswers[i], correct: false },
        }));
      }
    }

    const percentage = (numCorrect / numQuestions) * 100;
    setPercentageCorrect(percentage);
    setCorrectCount(numCorrect);
    setAnswersChecked(true);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'green';
    if (percentage >= 60) return 'blue';
    if (percentage >= 40) return 'orange';
    return 'red';
  };

  const getScoreEmoji = (percentage) => {
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👍';
    if (percentage >= 40) return '💪';
    return '📚';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'General Exercises', href: '/general-exercise' },
          { label: 'Comprehension' },
        ]}
        icon={IoHomeOutline}
      />
      
      <div className="mb-6">
        <Heading as="h1" className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Comprehension Check
        </Heading>
        <Text className="text-gray-600 dark:text-gray-400">
          Test your understanding of what you just read
        </Text>
      </div>

      {!answersChecked && (
        <Callout.Root className="mb-6">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            Select the best answer for each question. Answer all questions to see your results.
          </Callout.Text>
        </Callout.Root>
      )}

      {/* Progress indicator */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600">
        <Flex justify="between" align="center" wrap="wrap" gap="3">
          <div>
            <Text className="text-sm text-gray-500 dark:text-gray-400">Progress</Text>
            <Text className="font-bold block text-gray-900 dark:text-white">
              {Object.keys(selectedAnswers).length} of {questions?.length || 0} answered
            </Text>
          </div>
          <Flex gap="2">
            {readingSpeed && (
              <Badge color="blue" size="2">⚡ {readingSpeed} WPM</Badge>
            )}
            <Badge 
              color={allQuestionsAnswered ? 'green' : 'gray'} 
              size="2"
            >
              {allQuestionsAnswered ? '✓ Ready to submit' : 'In progress'}
            </Badge>
          </Flex>
        </Flex>
        {/* Progress bar */}
        <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(Object.keys(selectedAnswers).length / (questions?.length || 1)) * 100}%` }}
          />
        </div>
      </Card>

      {/* Questions */}
      {questions && questions.map((question, index) => (
        <Card 
          key={index} 
          className={`p-5 mb-4 transition-all ${
            answersChecked 
              ? selectedAnswers[index]?.correct 
                ? 'border-2 border-green-300 bg-green-50 dark:bg-green-900/30 dark:border-green-700' 
                : 'border-2 border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-700'
              : selectedAnswers[index]?.answer 
                ? 'border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-700' 
                : ''
          }`}
        >
          <Flex justify="between" align="start" className="mb-3">
            <Text className="font-bold text-gray-800 dark:text-gray-200">
              <Badge color="gray" size="1" className="mr-2">Q{index + 1}</Badge>
              {question.question}
            </Text>
            {answersChecked && (
              selectedAnswers[index]?.correct 
                ? <IoCheckmarkCircle className="text-green-500 text-xl flex-shrink-0" />
                : <IoCloseCircle className="text-red-500 text-xl flex-shrink-0" />
            )}
          </Flex>
          
          <div className="space-y-2 mt-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = selectedAnswers[index]?.answer === option;
              const isCorrectAnswer = question.correctAnswer === option;
              
              let optionStyle = 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30';
              if (answersChecked) {
                if (isCorrectAnswer) {
                  optionStyle = 'border-green-400 bg-green-100 dark:bg-green-900/40';
                } else if (isSelected && !selectedAnswers[index]?.correct) {
                  optionStyle = 'border-red-400 bg-red-100 dark:bg-red-900/40';
                } else {
                  optionStyle = 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-blue-400 bg-blue-100 dark:bg-blue-900/40';
              }
              
              return (
                <label 
                  key={optionIndex} 
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${optionStyle} ${answersChecked ? 'cursor-default' : ''}`}
                  onClick={() => handleAnswerSelect(index, option)}
                >
                  <input
                    type="radio"
                    name={`question_${index}`}
                    value={option}
                    checked={isSelected}
                    onChange={() => {}}
                    disabled={answersChecked}
                    className="mr-3 h-4 w-4"
                  />
                  <span className={`flex-1 text-gray-800 dark:text-gray-200 ${
                    answersChecked && isCorrectAnswer ? 'text-green-700 dark:text-green-400 font-semibold' : ''
                  } ${answersChecked && isSelected && !selectedAnswers[index]?.correct ? 'text-red-700 dark:text-red-400 line-through' : ''}`}>
                    {option}
                  </span>
                  {answersChecked && isCorrectAnswer && (
                    <Badge color="green" size="1">Correct</Badge>
                  )}
                </label>
              );
            })}
          </div>
        </Card>
      ))}

      {/* Submit Button */}
      {!answersChecked && (
        <Flex justify="center" className="mt-6">
          <Button 
            variant="solid" 
            color="blue" 
            size="3"
            onClick={handleCheckAnswers}
            disabled={!allQuestionsAnswered}
            className="cursor-pointer"
          >
            <CheckCircledIcon className="mr-2" /> Check Answers
          </Button>
        </Flex>
      )}

      {/* Results Card */}
      {answersChecked && (
        <Card className="p-6 mt-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600">
          <div className="text-center">
            <div className="text-5xl mb-3">{getScoreEmoji(percentageCorrect)}</div>
            <Heading as="h2" size="6" className="mb-2 text-gray-900 dark:text-white">
              Your Score
            </Heading>
            <div className="mb-4">
              <Text className="text-4xl font-bold" style={{ color: percentageCorrect >= 60 ? '#16a34a' : '#dc2626' }}>
                {percentageCorrect.toFixed(0)}%
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 block mt-1">
                {correctCount} out of {questions?.length} correct
              </Text>
            </div>
            
            <Badge color={getScoreColor(percentageCorrect)} size="2" className="mb-4">
              {percentageCorrect >= 80 ? 'Excellent!' : percentageCorrect >= 60 ? 'Good job!' : percentageCorrect >= 40 ? 'Keep practicing!' : 'Review the text'}
            </Badge>
            
            <Flex justify="center" gap="3" className="mt-4">
              <Link to="/general-exercise">
                <Button variant="outline" size="3" className="cursor-pointer">
                  More Exercises
                </Button>
              </Link>
              <Link to="/result" state={{ readingSpeed, percentageCorrect, exercisedata }}>
                <Button variant="solid" color="blue" size="3" className="cursor-pointer">
                  View Full Results <FaRegArrowAltCircleRight className="ml-2" />
                </Button>
              </Link>
            </Flex>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Comprehension;
