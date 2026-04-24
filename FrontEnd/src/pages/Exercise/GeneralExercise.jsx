import React, { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  Select,
  Text,
  Progress,
} from '@radix-ui/themes';
import { IoHomeOutline, IoEyeOutline, IoSpeedometerOutline, IoFlashOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { InfoCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumb';

function GeneralExercise() {
  const [selectedLevel, setSelectedLevel] = useState('level6'); // Default to max level
  const [maxAge, setMaxAge] = useState(18); // Default to max age

  const handleLevelChange = (event) => {
    setSelectedLevel(event);
    switch (event) {
      case 'level1':
        setMaxAge(8);
        break;
      case 'level2':
        setMaxAge(10);
        break;
      case 'level3':
        setMaxAge(12);
        break;
      case 'level4':
        setMaxAge(14);
        break;
      case 'level5':
        setMaxAge(16);
        break;
      case 'level6':
        setMaxAge(18);
        break;
      default:
        setMaxAge(18);
        break;
    }
  }

  const getLevelNumber = () => parseInt(selectedLevel.slice(-1));
  const getLevelName = () => {
    const names = {
      level1: 'Beginner',
      level2: 'Elementary', 
      level3: 'Intermediate',
      level4: 'Upper Intermediate',
      level5: 'Advanced',
      level6: 'Expert'
    };
    return names[selectedLevel] || 'Expert';
  };

  const exercises = [
    { 
      title: 'Practice Fixation', 
      description: 'Train your eyes to focus on text with guided reading. Great for beginners.',
      level: 'Easy', 
      path: "/exercise-one",
      icon: IoEyeOutline,
      duration: '3-5 min'
    },
    { 
      title: 'Subvocalization Training', 
      description: 'Learn to read without silently pronouncing words. Dramatically improves speed.',
      level: 'Medium', 
      path: "/subvocalization",
      icon: IoSpeedometerOutline,
      duration: '5-7 min'
    },
    { 
      title: 'Advanced Fixation', 
      description: 'Word-by-word highlighting to improve focus and reduce regression.',
      level: 'Hard', 
      path: "/fixations",
      icon: IoFlashOutline,
      duration: '4-6 min'
    },
    { 
      title: 'Skimming Practice', 
      description: 'Quickly scan text to find key information. Essential for efficient reading.',
      level: 'Hard', 
      path: "/skimming",
      icon: IoDocumentTextOutline,
      duration: '5-8 min'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'General Exercise', href: '/general-exercise' },
        ]}
        icon={IoHomeOutline}
      />
      
      <div className="mb-8">
        <Heading as="h1" className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Reading Exercises
        </Heading>
        <Text className="text-gray-600 dark:text-gray-400">
          Improve your reading speed with scientifically-designed exercises
        </Text>
      </div>

      {/* Level Selection Card */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600">
        <Flex gap="4" alignItems="center" justify="between" wrap="wrap">
          <div className="flex-1 min-w-[200px]">
            <Text className="font-semibold text-gray-700 dark:text-gray-200 mb-2 block">Difficulty Level</Text>
            <Select.Root onValueChange={handleLevelChange} defaultValue={selectedLevel}>
              <Select.Trigger variant="surface" className="w-full" />
              <Select.Content>
                <Select.Item value="level1">Level 1 - Beginner</Select.Item>
                <Select.Item value="level2">Level 2 - Elementary</Select.Item>
                <Select.Item value="level3">Level 3 - Intermediate</Select.Item>
                <Select.Item value="level4">Level 4 - Upper Intermediate</Select.Item>
                <Select.Item value="level5">Level 5 - Advanced</Select.Item>
                <Select.Item value="level6">Level 6 - Expert</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getLevelNumber()}</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 block">Level</Text>
            </div>
            <div className="h-12 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="text-center">
              <Text className="font-semibold text-gray-700 dark:text-gray-200">{getLevelName()}</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 block">Difficulty</Text>
            </div>
          </div>
        </Flex>
        
        {/* Level progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-300"
              style={{ width: `${(getLevelNumber() / 6) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      <Callout.Root className="mb-6">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Each exercise adapts to your selected difficulty level. Start with easier levels and progress as you improve.
        </Callout.Text>
      </Callout.Root>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise, index) => (
          <ExerciseCard key={index} index={index + 1} {...exercise} maxAge={maxAge} />
        ))}
      </div>
    </div>
  );
}

const ExerciseCard = ({ title, description, path, level, maxAge, icon: Icon, duration, index }) => {
  const badgeColors = {
    Easy: { color: 'green', bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-700', iconBg: 'bg-green-100 dark:bg-green-800' },
    Medium: { color: 'orange', bg: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-700', iconBg: 'bg-orange-100 dark:bg-orange-800' },
    Hard: { color: 'red', bg: 'bg-red-50 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-700', iconBg: 'bg-red-100 dark:bg-red-800' },
  };
  const style = badgeColors[level] || badgeColors.Easy;

  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-300 border-2 ${style.border} ${style.bg} group`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-xl ${style.iconBg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <Text className="text-sm text-gray-500 dark:text-gray-400 font-medium">Exercise {index}</Text>
            <Badge color={style.color} radius="full" size="1">{level}</Badge>
          </div>
          
          <Heading as="h3" size="4" className="mb-2 text-gray-900 dark:text-white">{title}</Heading>
          <Text className="text-sm text-gray-600 dark:text-gray-400 block mb-4 leading-relaxed">{description}</Text>
          
          <div className="flex items-center justify-between">
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              ⏱️ {duration}
            </Text>
            <Link to={path} state={{ maxAge: maxAge }}>
              <Button variant="solid" size="2" className="cursor-pointer group-hover:scale-105 transition-transform">
                Start Exercise
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GeneralExercise;
