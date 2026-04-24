import React, { useState, useEffect } from 'react';
import { Button, Card, Heading, Flex, Callout, Badge, Dialog, Text, Progress } from '@radix-ui/themes';
import { IoPlayCircleOutline, IoPauseCircleOutline, IoStopCircleOutline, IoRefreshOutline } from 'react-icons/io5';
import Breadcrumbs from '../../components/Breadcrumb';
import { IoHomeOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { InfoCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import './ExerciseOne.css'; // Import CSS file for animations
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaRegArrowAltCircleRight, FaTrophy } from 'react-icons/fa';

function ExerciseOne() {
  const [exercise, setExercise] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [showText, setShowText] = useState(false);
  const [timer, setTimer] = useState(0);
  const [endReading, setEndReading] = useState(true);
  const [readingSpeed, setReadingSpeed] = useState(null);
  const [showReadingSpeedPopup, setShowReadingSpeedPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const maxAge = location.state?.maxAge || 18;

  const getExercisebyAge = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/exercise/getByAge/${maxAge}`);
      setExercise(response.data);
      toast.success('Exercise loaded!');
    } catch (error) {
      console.error('Error fetching exercise:', error);
      toast.error('Failed to load exercise. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (isReading) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  useEffect(() => {
    getExercisebyAge();
  }, []);

  const handleStartReading = () => {
    toast.success('Reading started! Focus on the text.');
    setIsReading(true);
    setShowText(true);
    const card = document.getElementById('reading-card');
    card?.classList.add('start-reading-animation');
  };

  const handleEndReading = () => {
    setIsReading(false);
    setEndReading(false);
    const card = document.getElementById('reading-card');
    card?.classList.remove('start-reading-animation');
    calculateReadingSpeed();
  };

  const handleReset = () => {
    setIsReading(false);
    setShowText(false);
    setTimer(0);
    setEndReading(true);
    setReadingSpeed(null);
    const card = document.getElementById('reading-card');
    card?.classList.remove('start-reading-animation');
    getExercisebyAge();
  };

  const calculateReadingSpeed = () => {
    const words = exercise[0]?.content?.text?.split(' ').length || 0;
    const speed = Math.round((words / (timer / 60)));
    setReadingSpeed(speed);
    setShowReadingSpeedPopup(true);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getSpeedRating = (wpm) => {
    if (wpm < 150) return { label: 'Slow Reader', color: 'orange', emoji: '📚' };
    if (wpm < 250) return { label: 'Average Reader', color: 'blue', emoji: '📖' };
    if (wpm < 400) return { label: 'Fast Reader', color: 'green', emoji: '⚡' };
    return { label: 'Speed Reader', color: 'purple', emoji: '🚀' };
  };

  const wordCount = exercise[0]?.content?.text?.split(' ').length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'General Exercises', href: '/general-exercise' },
          { label: 'Practice Fixation', href: '/exercise-one' },
        ]}
        icon={IoHomeOutline}
      />
      
      <div className="mb-6">
        <Heading as="h1" className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Practice Fixation
        </Heading>
        <Text className="text-gray-600 dark:text-gray-400">
          Train your eyes to follow text smoothly without jumping around
        </Text>
      </div>

      <Callout.Root className="mb-6">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Click <strong>Start Reading</strong> to reveal the text. The text will slowly scroll up. 
          Click <strong>End Reading</strong> when you've finished to see your reading speed.
        </Callout.Text>
      </Callout.Root>

      {loading ? (
        <Card className="p-8 text-center">
          <Text className="text-gray-400 dark:text-gray-500">Loading exercise...</Text>
        </Card>
      ) : (
        <>
          {/* Controls Card */}
          <Card className="p-4 mb-4">
            <Flex gap="4" justify="between" alignItems="center" wrap="wrap">
              <Flex gap="3" alignItems="center">
                {!showText ? (
                  <Button onClick={handleStartReading} variant="solid" color="green" size="3" className="cursor-pointer">
                    <IoPlayCircleOutline size={20} className="mr-1" /> Start Reading
                  </Button>
                ) : endReading ? (
                  <Button onClick={handleEndReading} variant="solid" color="red" size="3" className="cursor-pointer">
                    <IoStopCircleOutline size={20} className="mr-1" /> End Reading
                  </Button>
                ) : (
                  <Button onClick={handleReset} variant="outline" size="3" className="cursor-pointer">
                    <IoRefreshOutline size={20} className="mr-1" /> Try Again
                  </Button>
                )}
                
                {!endReading && (
                  <Link to="/comprehension" state={{ exercisedata: exercise[0], readingSpeed: readingSpeed }}>
                    <Button variant="solid" color="blue" size="3" className="cursor-pointer">
                      Continue <FaRegArrowAltCircleRight className="ml-1" />
                    </Button>
                  </Link>
                )}
              </Flex>

              <Flex gap="3" alignItems="center">
                <Badge size="2" color={isReading ? 'green' : 'gray'}>
                  {isReading ? '● Reading' : '○ Paused'}
                </Badge>
                <Badge size="2" color="blue">
                  ⏱️ {formatTime(timer)}
                </Badge>
                <Badge size="2" color="gray">
                  📝 {wordCount} words
                </Badge>
              </Flex>
            </Flex>
          </Card>

          {/* Reading Card */}
          <Card className="p-6 mb-4 min-h-[300px] overflow-hidden" id="reading-card">
            {showText ? (
              <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{exercise[0]?.content?.text}</p>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-6xl mb-4">📖</div>
                <Text className="text-gray-500 dark:text-gray-400 text-lg">Click "Start Reading" to reveal the text</Text>
                <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2">The text will scroll up automatically</Text>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Results Dialog */}
      <Dialog.Root open={showReadingSpeedPopup} onOpenChange={setShowReadingSpeedPopup}>
        <Dialog.Content className="max-w-md">
          <div className="text-center py-4">
            <div className="text-6xl mb-4">{readingSpeed && getSpeedRating(readingSpeed).emoji}</div>
            <Heading as="h2" className="text-2xl font-bold mb-2">
              Reading Complete!
            </Heading>
            <Badge color={readingSpeed && getSpeedRating(readingSpeed).color} size="2" className="mb-4">
              {readingSpeed && getSpeedRating(readingSpeed).label}
            </Badge>
            
            <Card className="p-4 mt-4 bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">{readingSpeed}</Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 block">Words/Minute</Text>
                </div>
                <div>
                  <Text className="text-3xl font-bold text-green-600 dark:text-green-400">{formatTime(timer)}</Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 block">Time Taken</Text>
                </div>
              </div>
            </Card>
            
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-4 block">
              Average reading speed is 200-250 WPM. Speed readers can achieve 400+ WPM!
            </Text>
            
            <Flex justify="center" gap="3" mt="4">
              <Button variant="outline" onClick={() => setShowReadingSpeedPopup(false)} className="cursor-pointer">
                Close
              </Button>
            </Flex>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export default ExerciseOne;
