import React, { useState, useEffect, useRef } from 'react';
import { IoPlay, IoPause } from 'react-icons/io5';
import { Button, Heading, Badge, Card, Text } from '@radix-ui/themes';
import { Box } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';

function SpeedReadingPage({ content, filteredExercises }) {
  const [playing, setPlaying] = useState(false);
  const [wpm, setWpm] = useState(200); // Words per minute
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [contentWords, setContentWords] = useState([]);
  const [textComplete, setTextComplete] = useState(false);
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (content) {
      setContentWords(content.split(' '));
    }
  }, [content]);

  const handlePlayPause = () => {
    if (!playing) {
      if (startTime === null) {
        setStartTime(Date.now());
      }
    }
    setPlaying(!playing);
  };

  const handleReplay = () => {
    setCurrentWordIndex(0);
    setPlaying(false);
    setTextComplete(false);
    setStartTime(null);
    setElapsedTime(0);
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
  };

  // Timer effect
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing]);

  // Word progression effect
  useEffect(() => {
    if (playing) {
      const intervalMs = 60000 / wpm; // milliseconds per word
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex((prevIndex) => {
          if (prevIndex < contentWords.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(intervalRef.current);
            setPlaying(false);
            setTextComplete(true);
            return prevIndex;
          }
        });
      }, intervalMs);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [playing, wpm, contentWords]);

  const calculateReadingSpeed = () => {
    if (elapsedTime > 0) {
      return Math.round((currentWordIndex / elapsedTime) * 60);
    }
    return 0;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleNext = () => {
    navigate('/comprehension', { state: { exercisedata: filteredExercises[0], readingSpeed: calculateReadingSpeed() } });
  };

  const handleAnother = () => {
    navigate('/general-exercise');
  };

  return (
    <div className="space-y-6">
      {/* WPM Slider Control */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <Text className="text-sm font-medium whitespace-nowrap">Speed:</Text>
            <input
              type="range"
              min="50"
              max="600"
              step="10"
              value={wpm}
              onChange={(e) => setWpm(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              disabled={playing}
            />
            <Badge color="blue" size="2" className="min-w-[80px] text-center">
              {wpm} WPM
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Badge color="gray" size="2">
              {currentWordIndex + 1} / {contentWords.length}
            </Badge>
            <Badge color="green" size="2">
              {formatTime(elapsedTime)}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Word Display */}
      <Card className="p-8">
        <div className="text-center py-12">
          <Heading 
            size="9" 
            className="transition-all duration-100"
            style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {contentWords[currentWordIndex] || '...'}
          </Heading>
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <Button
            onClick={handlePlayPause}
            className="cursor-pointer"
            variant="solid"
            color={playing ? 'red' : 'green'}
            size="3"
          >
            {playing ? <IoPause size={20} /> : <IoPlay size={20} />}
            <span className="ml-2">{playing ? 'Pause' : (currentWordIndex > 0 && !textComplete ? 'Resume' : 'Start')}</span>
          </Button>
          
          <Button
            onClick={handleReplay}
            variant="outline"
            className="cursor-pointer"
            size="3"
          >
            Replay
          </Button>

          {filteredExercises && textComplete && (
            <Button
              onClick={handleNext}
              className="cursor-pointer"
              variant="solid"
              color="blue"
              size="3"
            >
              Next: Comprehension <FaRegArrowAltCircleRight className="ml-2" />
            </Button>
          )}

          {!filteredExercises && textComplete && (
            <Button
              onClick={handleAnother}
              className="cursor-pointer"
              variant="solid"
              color="blue"
              size="3"
            >
              Try Another Exercise
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default SpeedReadingPage;
