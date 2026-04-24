import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, Heading, Text, Callout, Flex } from '@radix-ui/themes';
import { IoPlayCircleOutline, IoPauseCircleOutline, IoRefreshOutline } from 'react-icons/io5';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import Breadcrumbs from '../../components/Breadcrumb';
import { IoHomeOutline } from 'react-icons/io5';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

// Color mapping for highlight
const colorStyles = {
  green: { background: '#dcfce7', color: '#166534', name: 'Green' },
  blue: { background: '#dbeafe', color: '#1e40af', name: 'Blue' },
  purple: { background: '#f3e8ff', color: '#7e22ce', name: 'Purple' },
  orange: { background: '#ffedd5', color: '#c2410c', name: 'Orange' },
};

function FixationExercise() {
  const location = useLocation();
  const maxAge = location.state?.maxAge || 18;
  const [exercise, setExercise] = useState(null);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [highlightColor, setHighlightColor] = useState('green');
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState(null);

  // Fetch exercise data based on location state
  useEffect(() => {
    const fetchExerciseByAge = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/exercise/getByAge/${maxAge}`);
        setExercise(response.data[0]);
        toast.success('Exercise fetched successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch exercise');
      } finally {
        setLoading(false);
      }
    };
    fetchExerciseByAge();
  }, [maxAge]);

  // Extract sample text from exercise data
  useEffect(() => {
    const sampleText = exercise?.content?.text;
    if (sampleText) setWords(sampleText.split(' '));
  }, [exercise]);

  // Function to start or pause the exercise
  const handlePlayPause = () => {
    if (!hasStarted) setHasStarted(true);
    setIsPlaying(!isPlaying);
  };

  // Function to handle speed change
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  // Function to handle color change
  const handleColorChange = (newColor) => {
    setHighlightColor(newColor);
  };

  // Function to reset
  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setHasStarted(false);
    setIsComplete(false);
    setTimer(0);
    setReadingSpeed(null);
  };

  // Function to move to the next word
  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setIsPlaying(false);
      setIsComplete(true);
      // Calculate reading speed (words per minute)
      const wpm = Math.round((words.length / timer) * 60);
      setReadingSpeed(wpm);
      toast.success('Exercise completed!');
    }
  };

  // Timer effect
  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  // Start/stop interval for word highlighting
  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(nextWord, speed);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, currentIndex, speed]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Construct the text with highlighted current word
  const constructText = () => {
    if (words.length === 0) {
      return <Text className="text-gray-400">Loading text...</Text>;
    }
    return words.map((word, index) => {
      const isCurrent = index === currentIndex && hasStarted;
      return (
        <span
          key={index}
          style={{
            display: 'inline-block',
            padding: '2px 4px',
            margin: '2px',
            borderRadius: '4px',
            backgroundColor: isCurrent ? colorStyles[highlightColor].background : 'transparent',
            color: isCurrent ? colorStyles[highlightColor].color : 'inherit',
            fontWeight: isCurrent ? 'bold' : 'normal',
            opacity: hasStarted ? (isCurrent ? 1 : 0.4) : 1,
            transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
            transition: 'opacity 0.15s ease, transform 0.15s ease, background-color 0.15s ease',
          }}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'General Exercises', href: '/general-exercise' },
          { label: 'Advanced Fixation', href: '/fixations' },
        ]}
        icon={IoHomeOutline}
      />
      
      <div className="mb-6">
        <Heading as="h1" className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Advanced Fixation Training
        </Heading>
        <Text className="text-gray-600 dark:text-gray-400">
          Follow the highlighted word to train your eyes to move smoothly through text
        </Text>
      </div>

      {!hasStarted && !loading && (
        <Callout.Root className="mb-6">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            <strong>How it works:</strong> Words will highlight one at a time. Keep your eyes focused on the
            highlighted word without looking ahead or back. This reduces "regression" and improves reading flow.
          </Callout.Text>
        </Callout.Root>
      )}

      {/* Settings - moved to top */}
      <Card className="p-4 mb-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Speed:</span>
              <select
                value={speed}
                onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
                className="border dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
                disabled={isPlaying}>
                <option value={500}>Very Slow (120 WPM)</option>
                <option value={300}>Slow (200 WPM)</option>
                <option value={200}>Medium (300 WPM)</option>
                <option value={100}>Fast (600 WPM)</option>
                <option value={50}>Very Fast (1200 WPM)</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Highlight:</span>
              <div className="flex gap-1">
                {Object.keys(colorStyles).map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      highlightColor === color ? 'scale-110 border-gray-800' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: colorStyles[color].background }}
                    title={colorStyles[color].name}
                  />
                ))}
              </div>
            </div>
          </div>
          <Flex gap="2">
            <Badge color="gray" size="2">
              {hasStarted ? `${currentIndex + 1} / ${words.length}` : `${words.length} words`}
            </Badge>
            <Badge color="blue" size="2">
              ⏱️ {formatTime(timer)}
            </Badge>
          </Flex>
        </div>
      </Card>
      {loading ? (
        <Card className="p-8 mb-4 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
          </div>
          <Text className="text-gray-400 dark:text-gray-500 mt-4">Loading exercise...</Text>
        </Card>
      ) : isComplete ? (
        <Card className="p-8 mb-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-green-700">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <Heading as="h2" className="text-2xl font-bold mb-2 text-green-700 dark:text-green-400">
              Exercise Complete!
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400 block mb-6">Great focus training session!</Text>
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <Card className="p-3 bg-white dark:bg-gray-800">
                <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">{words.length}</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 block">Words</Text>
              </Card>
              <Card className="p-3 bg-white dark:bg-gray-800">
                <Text className="text-2xl font-bold text-green-600 dark:text-green-400">{formatTime(timer)}</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 block">Time</Text>
              </Card>
              <Card className="p-3 bg-white dark:bg-gray-800">
                <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">{readingSpeed}</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 block">WPM</Text>
              </Card>
            </div>
            
            <Flex justify="center" gap="3">
              <Button 
                onClick={handleReset}
                variant="outline" 
                className="cursor-pointer"
                size="3"
              >
                <IoRefreshOutline className="mr-1" /> Try Again
              </Button>
              <Link to="/comprehension" state={{ exercisedata: exercise, readingSpeed: readingSpeed }}>
                <Button variant="solid" color="blue" size="3" className="cursor-pointer">
                  Comprehension <FaRegArrowAltCircleRight className="ml-2" />
                </Button>
              </Link>
            </Flex>
          </div>
        </Card>
      ) : (
        <Card className="p-6 mb-4">
          {/* Controls */}
          <div className="flex justify-center items-center gap-4 pb-4 mb-4 border-b dark:border-gray-700">
            <Button
              onClick={handlePlayPause}
              className="cursor-pointer"
              variant="solid"
              color={isPlaying ? 'orange' : 'green'}
              size="3"
            >
              {isPlaying ? <IoPauseCircleOutline size={20} /> : <IoPlayCircleOutline size={20} />}
              <span className="ml-2">{isPlaying ? 'Pause' : (hasStarted ? 'Resume' : 'Start')}</span>
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline" 
              className="cursor-pointer"
              size="3"
              disabled={!hasStarted}
            >
              <IoRefreshOutline className="mr-1" /> Reset
            </Button>
          </div>

          {/* Text display area */}
          <div 
            className="text-lg p-4 rounded-lg text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800" 
            style={{ 
              lineHeight: '2.4',
              minHeight: '200px',
            }}
          >
            {constructText()}
          </div>
        </Card>
      )}
    </div>
  );
}

export default FixationExercise;
