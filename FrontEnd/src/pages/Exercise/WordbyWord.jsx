import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { IoHomeOutline } from 'react-icons/io5';
import { Button, Heading, Card, Text, Callout, Badge, Flex } from '@radix-ui/themes';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumb';
import { RiSpeakFill } from "react-icons/ri";
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { FaRegArrowAltCircleRight, FaRedo } from "react-icons/fa";

function WordbyWord() {
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const maxAge = location.state?.maxAge || 18;

  const getLevelName = (age) => {
    if (age <= 8) return 'Beginner';
    if (age <= 10) return 'Elementary';
    if (age <= 12) return 'Intermediate';
    if (age <= 14) return 'Upper Intermediate';
    if (age <= 16) return 'Advanced';
    return 'Expert';
  };

  const fetchExercise = async () => {
    setLoading(true);
    try {
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

  useEffect(() => {
    fetchExercise();
  }, [maxAge]);

  const handleStartReading = () => {
    if (!exercise) {
      toast.error('No exercise loaded');
      return;
    }
    navigate('/start-reading', { state: { filteredExercises: [exercise] } });
  };

  const wordCount = exercise?.content?.text?.split(' ').length || 0;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'General Exercises', href: '/general-exercise' },
          { label: 'Subvocalization Training', href: '/subvocalization' },
        ]} 
        icon={IoHomeOutline} 
      />
      
      <div className="mb-6">
        <Flex align="center" gap="3" className="mb-2">
          <Heading size="8" className="text-gray-900 dark:text-white">Subvocalization Training</Heading>
          <RiSpeakFill className={`text-2xl ${loading ? 'animate-pulse text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
        </Flex>
        <Text className="text-gray-600 dark:text-gray-400">
          Break the habit of silently pronouncing words to dramatically increase reading speed
        </Text>
      </div>

      <Callout.Root className="mb-6">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          <strong>What is Subvocalization?</strong> It's the inner voice that "reads" words in your head. 
          This exercise displays words one at a time at high speed, forcing your brain to process words visually 
          without speaking them internally.
        </Callout.Text>
      </Callout.Root>

      {/* Level indicator */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border border-purple-100 dark:border-gray-600">
        <Flex justify="between" align="center" wrap="wrap" gap="3">
          <div>
            <Text className="text-sm text-gray-500 dark:text-gray-400">Current Level</Text>
            <Text className="font-bold text-lg block text-gray-900 dark:text-white">{getLevelName(maxAge)}</Text>
          </div>
          <Flex gap="3">
            <Badge color="purple" size="2">📝 {wordCount} words</Badge>
            <Badge color="blue" size="2">⏱️ ~{Math.ceil(wordCount / 200)} min</Badge>
          </Flex>
        </Flex>
      </Card>

      {/* Exercise Preview */}
      <Card className="p-6 mb-6">
        <Text className="font-semibold mb-3 block text-gray-700 dark:text-gray-200">Text Preview</Text>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700 max-h-48 overflow-y-auto">
            <Text className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {exercise?.content?.text || 'No exercise content available'}
            </Text>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <Card className="p-4">
        <Flex gap="3" justify="between" wrap="wrap">
          <Button 
            onClick={fetchExercise} 
            variant="outline" 
            size="3" 
            className="cursor-pointer"
            disabled={loading}
          >
            <FaRedo className="mr-2" /> Load New Text
          </Button>
          <Button 
            onClick={handleStartReading} 
            variant="solid" 
            color="green" 
            size="3" 
            className="cursor-pointer"
            disabled={!exercise || loading}
          >
            Start Speed Reading <FaRegArrowAltCircleRight className="ml-2" />
          </Button>
        </Flex>
      </Card>

      {/* Tips Card */}
      <Card className="p-4 mt-6 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700">
        <Text className="font-semibold mb-2 block text-gray-800 dark:text-gray-200">💡 Tips for Success</Text>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Focus only on the center of the screen</li>
          <li>• Try to visualize meanings, not sounds</li>
          <li>• Start at a comfortable speed, then increase gradually</li>
          <li>• Don't worry if you miss some words at first</li>
        </ul>
      </Card>
    </div>
  );
}

export default WordbyWord;
