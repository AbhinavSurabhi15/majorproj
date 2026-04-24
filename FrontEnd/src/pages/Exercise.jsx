import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IoHomeOutline, IoSparklesSharp, IoBookOutline, IoLanguageOutline, IoPersonOutline, IoPlayCircle, IoTrashOutline, IoRefreshOutline, IoRocketOutline } from 'react-icons/io5';
import { FaChild, FaUserGraduate, FaUserTie, FaFlask, FaBook, FaLandmark, FaGlobe, FaWandMagicSparkles } from 'react-icons/fa6';
import { Button, Heading, Text, Card, Badge, Skeleton, TextArea } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumb';

function Exercise() {
  const navigate = useNavigate();
  const [ageGroup, setAgeGroup] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ageGroups = [
    { value: 'child', label: 'Child', icon: FaChild, desc: 'Ages 6-12' },
    { value: 'teen', label: 'Teen', icon: FaUserGraduate, desc: 'Ages 13-17' },
    { value: 'adult', label: 'Adult', icon: FaUserTie, desc: '18+' },
  ];

  const categories = [
    { value: 'literature', label: 'Literature', icon: FaBook, color: 'purple' },
    { value: 'science', label: 'Science', icon: FaFlask, color: 'green' },
    { value: 'history', label: 'History', icon: FaLandmark, color: 'amber' },
    { value: 'technology', label: 'Technology', icon: FaGlobe, color: 'blue' },
  ];

  const languages = [
    { value: 'english', label: 'English', flag: '🇺🇸' },
    { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
    { value: 'french', label: 'French', flag: '🇫🇷' },
    { value: 'hindi', label: 'Hindi', flag: '🇮🇳' },
    { value: 'german', label: 'German', flag: '🇩🇪' },
  ];

  const generateContent = async (prompt) => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error('API key not configured');
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      // Use gemini-2.0-flash which is available with this API key
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const generationConfig = {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      };

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      const text = response.text();
      if (!text) {
        throw new Error('Empty response from AI');
      }
      setGeneratedContent(text);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Gemini API Error:', error);
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        errorMessage = 'API quota exceeded. Please wait a minute and try again, or create a new API key at ai.google.dev';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = () => {
    if (!ageGroup || !category || !language) {
      toast.error('Please select all options');
      return;
    }
    toast.loading('AI is generating content...', { id: 'generating' });
    const prompt = `Generate an engaging and educational reading exercise text suitable for ${ageGroup}s about ${category} in ${language}. The text should be approximately 200-300 words, interesting, and appropriate for the age group. Include some thought-provoking elements to test comprehension.`;
    generateContent(prompt).then(() => toast.dismiss('generating'));
  };

  const handleStartReading = () => {
    if (!generatedContent.trim()) {
      toast.error('Please generate content first');
      return;
    }
    navigate('/start-reading', { state: { ageGroup, category, generatedContent } });
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Generative Exercise', href: '/generative-exercise' },
  ];

  const isFormValid = ageGroup && category && language;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} icon={IoHomeOutline} />

        {/* Header */}
        <div className="mb-8">
          <Heading as="h1" className="text-3xl font-bold mb-2">
            AI Reading Generator <IoSparklesSharp className="inline ml-2 text-purple-500" />
          </Heading>
          <Text className="text-gray-600">
            Create personalized reading exercises powered by AI. Select your preferences and let Gemini generate engaging content for you.
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Options */}
          <div className="md:col-span-1 space-y-6">
            {/* Age Group Selection */}
            <Card className="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-purple-100 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-4">
                <IoPersonOutline className="text-xl text-purple-600" />
                <Text weight="bold">Age Group</Text>
              </div>
              <div className="space-y-2">
                {ageGroups.map((age) => (
                  <button
                    key={age.value}
                    onClick={() => setAgeGroup(age.value)}
                    className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 bg-white dark:bg-gray-800 ${
                      ageGroup === age.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-purple-400'
                    }`}
                  >
                    <age.icon className={`text-xl ${ageGroup === age.value ? 'text-purple-600' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <div className={`font-medium ${ageGroup === age.value ? 'text-purple-600' : 'text-gray-700 dark:text-gray-300'}`}>
                        {age.label}
                      </div>
                      <div className="text-xs text-gray-500">{age.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Category Selection */}
            <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-4">
                <IoBookOutline className="text-xl text-blue-600" />
                <Text weight="bold">Category</Text>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center bg-white dark:bg-gray-800 ${
                      category === cat.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
                    }`}
                  >
                    <cat.icon className={`text-2xl mx-auto mb-1 ${category === cat.value ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div className={`text-sm font-medium ${category === cat.value ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                      {cat.label}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Language Selection */}
            <Card className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-100 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-4">
                <IoLanguageOutline className="text-xl text-green-600" />
                <Text weight="bold">Language</Text>
              </div>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setLanguage(lang.value)}
                    className={`px-3 py-2 rounded-lg border-2 transition-all flex items-center gap-2 bg-white dark:bg-gray-800 ${
                      language === lang.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-green-400'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className={`text-sm font-medium ${language === lang.value ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'}`}>
                      {lang.label}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateContent}
              size="3"
              className="w-full cursor-pointer"
              color="purple"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <IoRefreshOutline className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FaWandMagicSparkles className="mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Generated Content */}
          <div className="md:col-span-2">
            <Card className="p-6 h-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <IoRocketOutline className="text-xl text-blue-600" />
                  <Text weight="bold" size="4">Generated Content</Text>
                </div>
                {generatedContent && (
                  <Badge color="green" variant="soft">Ready to read</Badge>
                )}
              </div>

              {/* Selection Summary */}
              {(ageGroup || category || language) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {ageGroup && (
                    <Badge color="purple" variant="outline">
                      {ageGroups.find(a => a.value === ageGroup)?.label}
                    </Badge>
                  )}
                  {category && (
                    <Badge color="blue" variant="outline">
                      {categories.find(c => c.value === category)?.label}
                    </Badge>
                  )}
                  {language && (
                    <Badge color="green" variant="outline">
                      {languages.find(l => l.value === language)?.flag} {languages.find(l => l.value === language)?.label}
                    </Badge>
                  )}
                </div>
              )}

              <Skeleton loading={loading}>
                <div className="relative">
                  <TextArea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    placeholder={loading ? "AI is generating content..." : "Your AI-generated reading exercise will appear here. Select your preferences and click 'Generate Content' to start."}
                    rows={14}
                    className="w-full resize-none text-base leading-relaxed"
                    size="3"
                  />
                </div>
              </Skeleton>

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <Text color="red" size="2">{error}</Text>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between mt-6 gap-4">
                <Button
                  onClick={() => setGeneratedContent('')}
                  variant="soft"
                  color="gray"
                  className="cursor-pointer"
                  disabled={!generatedContent}
                >
                  <IoTrashOutline className="mr-1" />
                  Clear
                </Button>
                <Button
                  onClick={handleStartReading}
                  size="3"
                  color="blue"
                  className="cursor-pointer flex-1 max-w-xs"
                  disabled={!generatedContent.trim()}
                >
                  <IoPlayCircle className="mr-2 text-xl" />
                  Start Reading Exercise
                </Button>
              </div>

              {/* Tips */}
              {!generatedContent && !loading && (
                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-900">
                  <Text size="2" className="text-blue-800 dark:text-blue-300 font-medium mb-2 block">
                    💡 Tips for best results:
                  </Text>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                    <li>Choose an age group that matches your reading level</li>
                    <li>Select a category you're interested in learning about</li>
                    <li>You can edit the generated content before starting</li>
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </div>
    </div>
  );
}

export default Exercise;
