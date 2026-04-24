import React, { useState, useEffect, useRef } from 'react';
import { Button, Heading, Text, Badge, Card, Callout } from '@radix-ui/themes';
import Breadcrumbs from '../../components/Breadcrumb';
import { IoHomeOutline } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';
import professionalImage from '/img/skimming/img1.jpg';
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { InfoCircledIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function SkimmingExercise() {
  const location = useLocation();
  const maxAge = location.state?.maxAge || 18;
  
  const [phase, setPhase] = useState('ready'); // 'ready', 'skimming', 'complete'
  const [timer, setTimer] = useState(5);
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
    setTimer(5);
    
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
    setTimer(5);
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
          { label: 'Exercise 4: Skimming', href: '/skimming' },
        ]}
        icon={IoHomeOutline}
      />
      <Heading as="h1" className="text-3xl font-bold mb-4">
        Exercise 4: Skimming
      </Heading>
      
      <Callout.Root className="mb-4">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          <strong>Skimming</strong> is quickly glancing through text to get the main idea without reading every word.
          You'll have <strong>5 seconds</strong> to read the text, then answer comprehension questions.
        </Callout.Text>
      </Callout.Root>

      {loading ? (
        <Card className="p-8 text-center">
          <Text className="text-gray-400">Loading exercise...</Text>
        </Card>
      ) : phase === 'ready' ? (
        <Card className="p-8">
          <div className="text-center space-y-6">
            <Heading as="h2" className="text-xl">Ready to Start?</Heading>
            <Text className="block text-gray-600">
              A text passage will appear for 5 seconds. Try to quickly identify the main topic and key points.
              Don't try to read every word - just skim!
            </Text>
            <div className="space-y-2">
              <Text className="block text-sm text-gray-500">Tips for skimming:</Text>
              <ul className="text-sm text-gray-500 text-left max-w-md mx-auto">
                <li>• Look at the first and last sentences</li>
                <li>• Notice bold or emphasized words</li>
                <li>• Get the general idea, not details</li>
              </ul>
            </div>
            <Button 
              onClick={handleStartSkimming} 
              size="4" 
              color="blue"
              className="cursor-pointer"
            >
              Start Skimming
            </Button>
          </div>
        </Card>
      ) : phase === 'skimming' ? (
        <Card className="p-6">
          {/* Timer bar */}
          <div className="mb-4 flex justify-between items-center">
            <Badge color={timer <= 2 ? 'red' : 'blue'} size="3">
              ⏱️ {timer} seconds remaining
            </Badge>
            <div 
              className="h-2 bg-gray-200 rounded-full flex-1 mx-4 overflow-hidden"
            >
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${timer <= 2 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${(timer / 5) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Text content */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <Text className="text-lg leading-relaxed">
              {exercise?.content?.text || 'Loading content...'}
            </Text>
          </div>
        </Card>
      ) : (
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="text-6xl">✅</div>
            <Heading as="h2" className="text-xl text-green-600">Time's Up!</Heading>
            <Text className="block text-gray-600">
              Now let's see how much you remember. Click below to answer the comprehension questions.
            </Text>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleReset}
                variant="outline" 
                className="cursor-pointer"
              >
                Try Again
              </Button>
              <Link to="/comprehension" state={{ exercisedata: exercise, readingSpeed: 200 }}>
                <Button color="blue" className="cursor-pointer">
                  Comprehension Questions <FaRegArrowAltCircleRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default SkimmingExercise;
