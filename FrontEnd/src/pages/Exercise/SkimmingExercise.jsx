import React, { useState, useEffect, useRef } from 'react';
import { Button, Heading, Text, Badge, Card, Callout, Flex } from '@radix-ui/themes';
import Breadcrumbs from '../../components/Breadcrumb';
import { IoHomeOutline, IoRefreshOutline, IoEyeOutline } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { InfoCircledIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function SkimmingExercise() {
  const location = useLocation();
  const maxAge = location.state?.maxAge || 18;
  
  const [phase, setPhase] = useState('ready'); // 'ready', 'skimming', 'complete'
  const [selectedTime, setSelectedTime] = useState(7); // Default 7 seconds
  const [timer, setTimer] = useState(7);
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  // Fetch exercise on mount
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/exercise/getByAge/${maxAge}`);
        setExercise(response.data[0]);
        toast.success('Exercise loaded!');
      } catch (error) {
        console.error(error);
        toast.error('Failed to load exercise');
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [maxAge]);

  const handleStartSkimming = () => {
    setPhase('skimming');
    setTimer(selectedTime);
    
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setPhase('complete');
          toast.success('Time\'s up! Now answer the questions.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setPhase('ready');
    setTimer(selectedTime);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'General Exercises', href: '/general-exercise' },
          { label: 'Skimming Practice', href: '/skimming' },
        ]}
        icon={IoHomeOutline}
      />
      
      <div className="mb-6">
        <Heading as="h1" className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Skimming Practice
        </Heading>
        <Text className="text-gray-600 dark:text-gray-400">
          Learn to quickly identify main ideas without reading every word
        </Text>
      </div>
      
      <Callout.Root className="mb-6">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          <strong>Skimming</strong> is rapidly scanning text to find key information. 
          You'll have limited time to read, then answer comprehension questions.
        </Callout.Text>
      </Callout.Root>

      {loading ? (
        <Card className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
          <Text className="text-gray-400 mt-4">Loading exercise...</Text>
        </Card>
      ) : phase === 'ready' ? (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600">
          <div className="text-center space-y-6">
            <div className="text-6xl">👁️</div>
            <Heading as="h2" className="text-xl text-gray-900 dark:text-white">Ready to Skim?</Heading>
            <Text className="block text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              A text passage will appear for a limited time. Quickly identify the main topic and key points.
              Don't try to read every word — just skim!
            </Text>
            
            {/* Time selection */}
            <Card className="p-4 max-w-sm mx-auto bg-white dark:bg-gray-800">
              <Text className="font-semibold block mb-3 text-gray-800 dark:text-gray-200">Choose your challenge:</Text>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 5, label: '5 sec', difficulty: 'Hard', color: 'red' },
                  { value: 7, label: '7 sec', difficulty: 'Medium', color: 'orange' },
                  { value: 10, label: '10 sec', difficulty: 'Easy', color: 'green' },
                  { value: 15, label: '15 sec', difficulty: 'Beginner', color: 'blue' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedTime(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTime === option.value 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-105' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Text className="font-bold block text-gray-900 dark:text-white">{option.label}</Text>
                    <Badge color={option.color} size="1">{option.difficulty}</Badge>
                  </button>
                ))}
              </div>
            </Card>

            <div className="space-y-2 text-left max-w-md mx-auto">
              <Text className="block text-sm font-semibold text-gray-700 dark:text-gray-300">💡 Tips for skimming:</Text>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Read the first and last sentences first</li>
                <li>• Look for bold, italics, or emphasized words</li>
                <li>• Focus on nouns and verbs, skip connecting words</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleStartSkimming} 
              size="4" 
              color="blue"
              className="cursor-pointer"
            >
              <IoEyeOutline className="mr-2" /> Start Skimming
            </Button>
          </div>
        </Card>
      ) : phase === 'skimming' ? (
        <Card className="p-6">
          {/* Timer bar */}
          <div className="mb-4">
            <Flex justify="between" align="center" className="mb-2">
              <Badge color={timer <= 2 ? 'red' : 'blue'} size="3">
                ⏱️ {timer}s remaining
              </Badge>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Read quickly! Focus on main ideas.
              </Text>
            </Flex>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  timer <= 2 ? 'bg-red-500' : timer <= 4 ? 'bg-orange-500' : 'bg-blue-500'
                }`}
                style={{ width: `${(timer / selectedTime) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Text content */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-100 dark:border-gray-600 shadow-inner">
            <Text className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
              {exercise?.content?.text || 'Loading content...'}
            </Text>
          </div>
        </Card>
      ) : (
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-green-700">
          <div className="text-center space-y-6">
            <div className="text-6xl">✅</div>
            <Heading as="h2" className="text-xl text-green-700 dark:text-green-400">Time's Up!</Heading>
            <Text className="block text-gray-600 dark:text-gray-400">
              How much do you remember? Test your comprehension with questions about what you just read.
            </Text>
            <Flex justify="center" gap="4">
              <Button 
                onClick={handleReset}
                variant="outline" 
                size="3"
                className="cursor-pointer"
              >
                <IoRefreshOutline className="mr-1" /> Try Again
              </Button>
              <Link to="/comprehension" state={{ exercisedata: exercise, readingSpeed: Math.round((exercise?.content?.text?.split(' ').length / selectedTime) * 60) }}>
                <Button color="blue" size="3" className="cursor-pointer">
                  Answer Questions <FaRegArrowAltCircleRight className="ml-2" />
                </Button>
              </Link>
            </Flex>
          </div>
        </Card>
      )}
    </div>
  );
}

export default SkimmingExercise;
