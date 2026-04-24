import React, { useState, useEffect, useRef } from 'react';
import { IoPlay, IoPause, IoRefreshOutline } from 'react-icons/io5';
import { Button, Heading, Badge, Card, Text, Flex } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';

function SpeedReadingPage({ content, filteredExercises }) {
  const [playing, setPlaying] = useState(false);
  const [wpm, setWpm] = useState(250);
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

  useEffect(() => {
    if (playing) {
      const intervalMs = 60000 / wpm;
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
    return wpm;
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

  const progressPercent = contentWords.length > 0 ? ((currentWordIndex + 1) / contentWords.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Speed Control Card */}
      <Card className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4 flex-1 min-w-[250px]">
            <Text className="text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">Speed:</Text>
            <div className="flex-1 flex items-center gap-3">
              <input
                type="range"
                min="100"
                max="800"
                step="25"
                value={wpm}
                onChange={(e) => setWpm(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
                disabled={playing}
              />
              <Badge color="blue" size="2" className="min-w-[90px] text-center font-bold">
                {wpm} WPM
              </Badge>
            </div>
          </div>
          <Flex gap="2" align="center">
            <Badge color="gray" size="2">
              {currentWordIndex + 1} / {contentWords.length}
            </Badge>
            <Badge color="green" size="2">
              ⏱️ {formatTime(elapsedTime)}
            </Badge>
          </Flex>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Word Display */}
      <Card className="p-8 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <div className="text-center py-16">
          {textComplete ? (
            <div className="space-y-4">
              <div className="text-6xl mb-4">🎉</div>
              <Heading size="6" className="text-green-600 dark:text-green-400">Complete!</Heading>
              <Text className="text-gray-500 dark:text-gray-400 block">Actual speed: {calculateReadingSpeed()} WPM</Text>
            </div>
          ) : (
            <Heading 
              size="9" 
              className={`transition-all duration-75 ${playing ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200'}`}
              style={{ 
                minHeight: '80px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}
            >
              {contentWords[currentWordIndex] || 'Press Start'}
            </Heading>
          )}
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-4">
        <Flex justify="center" align="center" gap="4" wrap="wrap">
          <Button
            onClick={handlePlayPause}
            className="cursor-pointer"
            variant="solid"
            color={playing ? 'orange' : 'green'}
            size="3"
            disabled={textComplete}
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
            <IoRefreshOutline className="mr-1" /> Restart
          </Button>

          {filteredExercises && textComplete && (
            <Button
              onClick={handleNext}
              className="cursor-pointer"
              variant="solid"
              color="blue"
              size="3"
            >
              Comprehension <FaRegArrowAltCircleRight className="ml-2" />
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
              Try Another
            </Button>
          )}
        </Flex>
      </Card>

      {/* Speed Guide */}
      <Card className="p-3 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-600">
        <Flex gap="4" justify="center" wrap="wrap">
          <Text className="text-xs text-gray-600 dark:text-gray-400">📚 Slow: 100-200 WPM</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400">📖 Average: 200-300 WPM</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400">⚡ Fast: 300-500 WPM</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400">🚀 Speed Reader: 500+ WPM</Text>
        </Flex>
      </Card>
    </div>
  );
}

export default SpeedReadingPage;
