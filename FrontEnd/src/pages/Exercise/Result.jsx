import React, { useEffect, useState } from 'react';
import { Button, Card, Heading, Flex, Badge, Text } from '@radix-ui/themes';
import Breadcrumbs from '../../components/Breadcrumb';
import { IoHomeOutline, IoSpeedometer, IoTrophy, IoRocket, IoRefreshOutline } from 'react-icons/io5';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSave, FaBrain, FaChartLine, FaMedal, FaStar } from 'react-icons/fa';
import ConfettiExplosion from 'react-confetti-explosion';
import { getUserData, getLoggedIn } from '../../services/authService';
import { toast } from 'react-hot-toast';
import api from '../../services/axiosConfig.js';

function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const loggedIn = getLoggedIn();
  const userdata = getUserData();
  const percentageCorrect = state?.percentageCorrect || 0;
  const readingSpeed = state?.readingSpeed || 0;
  const exercisedata = state?.exercisedata;
  const userEmail = userdata?.user?.userEmail;

  const fetchUserDetails = async () => {
    if (!userEmail) return;
    setLoadingUser(true);
    try {
      const response = await api.post('/user/getAllDetails', { email: userEmail });
      setUserDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (loggedIn && userEmail) fetchUserDetails();
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, userEmail]);

  const userId = userDetails?._id;
  const speed = readingSpeed;
  const comprehensionPercentage = percentageCorrect;

  // Calculate score based on comprehension percentage and reading speed
  const calculateScore = () => {
    return Math.round((speed * comprehensionPercentage) / 100);
  };

  const score = calculateScore();

  // Get performance rating
  const getPerformance = () => {
    if (score >= 300) return { label: 'Outstanding!', emoji: '🏆', color: 'purple', stars: 5 };
    if (score >= 200) return { label: 'Excellent!', emoji: '🌟', color: 'green', stars: 4 };
    if (score >= 150) return { label: 'Great Job!', emoji: '👏', color: 'blue', stars: 3 };
    if (score >= 100) return { label: 'Good Work!', emoji: '👍', color: 'orange', stars: 2 };
    return { label: 'Keep Practicing!', emoji: '💪', color: 'gray', stars: 1 };
  };

  const getSpeedRating = () => {
    if (speed >= 400) return { label: 'Speed Reader', color: 'purple' };
    if (speed >= 300) return { label: 'Fast', color: 'green' };
    if (speed >= 200) return { label: 'Average', color: 'blue' };
    if (speed >= 150) return { label: 'Below Average', color: 'orange' };
    return { label: 'Slow', color: 'gray' };
  };

  const getComprehensionRating = () => {
    if (comprehensionPercentage >= 90) return { label: 'Perfect', color: 'green' };
    if (comprehensionPercentage >= 70) return { label: 'Good', color: 'blue' };
    if (comprehensionPercentage >= 50) return { label: 'Fair', color: 'orange' };
    return { label: 'Needs Work', color: 'red' };
  };

  const performance = getPerformance();
  const speedRating = getSpeedRating();
  const compRating = getComprehensionRating();

  const handleResult = async () => {
    if (!loggedIn || !userEmail) {
      toast.error('Please login to save your result');
      navigate('/login');
      return;
    }
    if (!exercisedata?._id) {
      toast.error('Missing exercise data — cannot save result');
      return;
    }
    if (!userId) {
      // userDetails still loading or failed — try once more before giving up
      toast.loading('Loading your account…', { id: 'save-result' });
      try {
        const response = await api.post('/user/getAllDetails', { email: userEmail });
        setUserDetails(response.data);
        if (!response.data?._id) {
          toast.error('Could not load your account. Please re-login.', { id: 'save-result' });
          return;
        }
        // continue saving with freshly fetched id
        await saveResult(response.data._id);
        toast.dismiss('save-result');
        return;
      } catch (err) {
        console.error(err);
        toast.error('Could not load your account. Please re-login.', { id: 'save-result' });
        return;
      }
    }
    await saveResult(userId);
  };

  const saveResult = async (uid) => {
    setSaving(true);
    try {
      await api.post('/user/result/create', {
        userId: uid,
        exerciseId: exercisedata._id,
        score: score,
        wpm: speed,
      });
      toast.success('Result saved successfully!');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save result. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {showConfetti && score >= 100 && (
        <ConfettiExplosion 
          numberOfPieces={300} 
          duration={4000} 
          force={0.8} 
          width={1600}
        />
      )}
      
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'General Exercises', href: '/general-exercise' },
          { label: 'Result' },
        ]}
        icon={IoHomeOutline}
      />

      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="text-7xl mb-4">{performance.emoji}</div>
        <Heading as="h1" className="text-4xl font-bold mb-2">
          {performance.label}
        </Heading>
        <div className="flex justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className={`text-2xl ${i < performance.stars ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <Text className="text-gray-600 dark:text-gray-400">Exercise completed successfully</Text>
      </div>

      {/* Main Score Card */}
      <Card className="p-8 mb-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-2 border-indigo-100 dark:border-gray-600">
        <div className="text-center">
          <Text className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Total Score</Text>
          <div className="flex items-center justify-center gap-2 my-2">
            <IoTrophy className="text-4xl text-yellow-500" />
            <span className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {score}
            </span>
          </div>
          <Badge color={performance.color} size="2">points earned</Badge>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Reading Speed Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600">
          <Flex align="center" gap="4">
            <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-900/40">
              <IoSpeedometer className="text-3xl text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-500 dark:text-gray-400 block">Reading Speed</Text>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">{speed}</span>
                <span className="text-gray-500 dark:text-gray-400">WPM</span>
              </div>
              <Badge color={speedRating.color} size="1">{speedRating.label}</Badge>
            </div>
          </Flex>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>0</span>
              <span>200 (avg)</span>
              <span>400+</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000"
                style={{ width: `${Math.min((speed / 400) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Comprehension Card */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-100 dark:border-gray-600">
          <Flex align="center" gap="4">
            <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/40">
              <FaBrain className="text-3xl text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-500 dark:text-gray-400 block">Comprehension</Text>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-700 dark:text-green-400">{comprehensionPercentage.toFixed(0)}</span>
                <span className="text-gray-500 dark:text-gray-400">%</span>
              </div>
              <Badge color={compRating.color} size="1">{compRating.label}</Badge>
            </div>
          </Flex>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  comprehensionPercentage >= 70 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  comprehensionPercentage >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${comprehensionPercentage}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Insights Card */}
      <Card className="p-5 mb-6 bg-slate-50 dark:bg-gray-800 border dark:border-gray-600">
        <Flex align="center" gap="3" className="mb-3">
          <FaChartLine className="text-xl text-slate-600 dark:text-slate-400" />
          <Text className="font-semibold text-gray-700 dark:text-gray-200">Performance Insights</Text>
        </Flex>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {speed >= 250 ? (
            <p>📚 Your reading speed is above average! You're reading faster than most adults.</p>
          ) : (
            <p>📚 Average adult reading speed is 200-250 WPM. Keep practicing to improve!</p>
          )}
          {comprehensionPercentage >= 80 ? (
            <p>🧠 Excellent comprehension! You understood the text very well.</p>
          ) : comprehensionPercentage >= 60 ? (
            <p>🧠 Good comprehension. Try slowing down slightly to improve accuracy.</p>
          ) : (
            <p>🧠 Focus on understanding over speed. Try reading at a slower pace.</p>
          )}
          <p>💡 <strong>Tip:</strong> Balance speed and comprehension for the best score!</p>
        </div>
      </Card>

      {/* Action Buttons */}
      <Card className="p-4">
        <Flex gap="3" justify="center" wrap="wrap">
          <Link to="/general-exercise">
            <Button variant="outline" size="3" className="cursor-pointer">
              <IoRefreshOutline className="mr-2" /> Try Another
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="3" className="cursor-pointer">
              <IoHomeOutline className="mr-2" /> Home
            </Button>
          </Link>
          {loggedIn && (
            <Button 
              onClick={handleResult} 
              size="3" 
              color="green"
              className="cursor-pointer"
              disabled={saving || loadingUser}
            >
              <FaSave className="mr-2" /> 
              {saving ? 'Saving...' : loadingUser ? 'Preparing…' : 'Save Result'}
            </Button>
          )}
        </Flex>
      </Card>

      {/* Achievement Badge */}
      {score >= 200 && (
        <div className="mt-6 text-center">
          <Card className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-700 inline-block">
            <Flex align="center" gap="2">
              <FaMedal className="text-2xl text-yellow-500" />
              <div>
                <Text className="font-bold text-yellow-800 dark:text-yellow-400">Achievement Unlocked!</Text>
                <Text className="text-sm text-yellow-600 dark:text-yellow-500 block">
                  {score >= 300 ? 'Master Reader' : 'Skilled Reader'}
                </Text>
              </div>
            </Flex>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Result;
