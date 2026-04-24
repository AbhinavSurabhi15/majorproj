import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, Heading, Text } from '@radix-ui/themes';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import Breadcrumbs from '../../components/Breadcrumb';
import { IoHomeOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

// Color mapping for highlight
const colorStyles = {
  green: { background: '#dcfce7', color: '#166534' },
  blue: { background: '#dbeafe', color: '#1e40af' },
  purple: { background: '#f3e8ff', color: '#7e22ce' },
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
          { label: 'Exercise 3: Fixation Type 2 Exercise', href: '/general-exercise' },
        ]}
        icon={IoHomeOutline}
      />
      <Heading as="h1" className="text-3xl font-bold mb-4">
        Exercise 3: Fixation Type 2 Exercise
      </Heading>

      {/* Settings - moved to top */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Speed:</span>
              <select
                value={speed}
                onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
                disabled={isPlaying}
              >
                <option value={500}>Very Slow</option>
                <option value={300}>Slow</option>
                <option value={200}>Medium</option>
                <option value={100}>Fast</option>
                <option value={50}>Very Fast</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Color:</span>
              <select
                value={highlightColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
              </select>
            </div>
          </div>
          <Badge color="gray" size="2">
            {hasStarted ? `${currentIndex + 1} / ${words.length}` : `${words.length} words`}
          </Badge>
          <Badge color="blue" size="2">
            Time: {formatTime(timer)}
          </Badge>
        </div>
      </Card>
      
      {loading ? (
        <Card className="p-6 mb-4">
          <Text className="text-gray-400">Loading exercise...</Text>
        </Card>
      ) : isComplete ? (
        <Card className="p-6 mb-4">
          <div className="text-center py-8">
            <Heading as="h2" className="text-2xl font-bold mb-4 text-green-600">
              🎉 Exercise Complete!
            </Heading>
            <div className="mb-6 space-y-2">
              <Text className="block text-lg">
                <strong>Words Read:</strong> {words.length}
              </Text>
              <Text className="block text-lg">
                <strong>Time Taken:</strong> {formatTime(timer)}
              </Text>
              <Text className="block text-lg">
                <strong>Reading Speed:</strong> {readingSpeed} WPM
              </Text>
            </div>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleReset}
                variant="outline" 
                className="cursor-pointer"
                size="3"
              >
                Try Again
              </Button>
              <Link to="/comprehension" state={{ exercisedata: exercise, readingSpeed: readingSpeed }}>
                <Button className="cursor-pointer" variant="solid" color="blue" size="3">
                  Next: Comprehension <FaRegArrowAltCircleRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 mb-4">
          {/* Controls - at top */}
          <div className="flex justify-center items-center gap-4 pb-4 mb-4 border-b">
            <Button
              onClick={handlePlayPause}
              className="cursor-pointer"
              variant="solid"
              color="blue"
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
              Reset
            </Button>
          </div>

          {/* Text display area */}
          <div 
            className="text-lg" 
            style={{ 
              lineHeight: '2.2',
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
