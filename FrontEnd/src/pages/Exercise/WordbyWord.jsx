import axios from 'axios';
import React, { useState, useEffect } from 'react';
// .env file import
import { toast } from 'react-hot-toast';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { IoHomeOutline, IoSparklesSharp } from 'react-icons/io5';
import {Button, Heading, Skeleton, TextArea} from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumb';
import { useLocation } from 'react-router-dom';
import { RiSpeakFill } from "react-icons/ri";


function WordbyWord() {
  
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(false);

  const maxAgeToGrade = (maxAge) => {
    switch (maxAge) {
      case 8:
        return 'grade1';
      case 10:
        return 'grade2';
      case 12:
        return 'grade3';
      case 14:
        return 'grade4';
      case 16:
        return 'grade5';
      case 18:
        return 'grade6';
      default:
        return '';
    }
  };

const location = useLocation();
const maxAge = location.state?.maxAge || 18;
const [ageGroup1, setAgeGroup1] = useState(maxAgeToGrade(maxAge));
console.log(maxAge);

// Fetch exercise on component mount
useEffect(() => {
  const fetchExercise = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/exercise/getByAge/${maxAge}`);
      console.log(response.data);
      setExercise(response.data[0]); // API returns array with one random exercise
      toast.success('Exercise fetched successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch exercise');
    } finally {
      setLoading(false);
    }
  };
  fetchExercise();
}, [maxAge]);

  const navigate = useNavigate();
  const [generatedContent, setGeneratedContent] = useState('');

  const handleStartReading = () => {
    if (!exercise) {
      toast.error('No exercise loaded');
      return;
    }
    navigate('/start-reading', { state: { filteredExercises: [exercise] } });
  };
  
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Exercise 2: Subvocalization', href: '/exercise' },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
       <Breadcrumbs items={breadcrumbs} icon={IoHomeOutline} /> 
       
      <Heading size="8" className="mb-2">Exercise 2: Subvocalization <RiSpeakFill className={`ml-1 inline ${loading && "animate-ping"}  `} /></Heading>
      
      {/* Exercise explanation */}
      <p className="text-gray-600 mb-4">
        This exercise displays words <strong>one at a time</strong> to help you stop "reading aloud in your head" (subvocalization). 
        Training at faster speeds forces your brain to process words visually, improving reading speed.
      </p>

      <div className="flex space-x-4 mb-4">
      <select
  value={ageGroup1}
  onChange={(e) => setAgeGroup1(e.target.value)}
  className="border rounded-md px-3 py-2 w-1/3 focus:outline-none disabled:opacity-50 disabled:bg-gray-200"
  disabled
>
  <option value="" >Select your grade</option>
  <option value="grade1">Grade 1 (6-8 Year Old)</option>
  <option value="grade2">Grade 2 (8-10 Year Old)</option>
  <option value="grade3">Grade 3 (10-12 Year Old)</option>
  <option value="grade4">Grade 4 (12-14 Year Old)</option>
  <option value="grade5">Grade 5 (14-16 Year Old)</option>
  <option value="grade6">Grade 6 (16-18+ Year Old)</option>
</select>
</div>


      <Skeleton loading={loading}>

      <TextArea
        value={exercise?.content?.text || ''}
        placeholder="Loading exercise content..."
        rows={6}
        className="w-full resize-none border rounded-md p-2 focus:outline-none"
        readOnly
        />
        </Skeleton>
      <div className='flex justify-between'>
      <Button
        onClick={() => setExercise(null)}
        className="mt-4 cursor-pointer"
      >
        Clear
      </Button>
      {/* button for start reading */}
      <Button onClick={handleStartReading} className="mt-4 cursor-pointer" disabled={!exercise}>
          Start Reading
        </Button>
      </div>
    </div>
  );
}

export default WordbyWord;
