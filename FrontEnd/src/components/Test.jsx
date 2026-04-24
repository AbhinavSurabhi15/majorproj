import React from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { Heading, Text, Callout } from '@radix-ui/themes';
import Breadcrumbs from '../components/Breadcrumb';
import { useLocation } from 'react-router-dom';
import SpeedReadingPage from '../pages/Reading/SpeedReadingPage';
import { InfoCircledIcon } from '@radix-ui/react-icons';

function Test() {
  const location = useLocation();
  const { filteredExercises, generatedContent } = location?.state || {};

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'General Exercises', href: '/general-exercise' },
    { label: 'Speed Reading', href: '/start-reading' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} icon={IoHomeOutline} />
      
      <div className="mb-6">
        <Heading size="8" className="mb-2">Speed Reading</Heading>
        <Text className="text-gray-600">
          Words appear one at a time to train your brain to read faster
        </Text>
      </div>

      <Callout.Root className="mb-6">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Focus on the center of the screen. Words will appear one at a time at your chosen speed.
          Try to understand the meaning without pronouncing words in your head.
        </Callout.Text>
      </Callout.Root>

      {filteredExercises && (
        <SpeedReadingPage 
          content={filteredExercises[0]?.content?.text} 
          filteredExercises={filteredExercises} 
        />
      )}
      {generatedContent && !filteredExercises && (
        <SpeedReadingPage content={generatedContent} />
      )}
    </div>
  );
}

export default Test;
