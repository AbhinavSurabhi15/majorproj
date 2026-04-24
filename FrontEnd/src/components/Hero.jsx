import React from 'react';
import { Box, Card, Badge, Text, Heading, Button, Flex } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { IoSpeedometerOutline, IoFlashOutline, IoPlayCircleOutline, IoArrowForward } from 'react-icons/io5';
import { FaBrain, FaChartLine, FaUsers, FaRocket } from 'react-icons/fa';

function Hero() {
  const stats = [
    { value: '2x', label: 'Faster Reading', icon: IoSpeedometerOutline },
    { value: '95%', label: 'Better Retention', icon: FaBrain },
    { value: '10k+', label: 'Active Users', icon: FaUsers },
    { value: '50+', label: 'Exercises', icon: IoFlashOutline },
  ];

  const features = [
    {
      icon: IoFlashOutline,
      title: 'Speed Training',
      description: 'Scientifically designed exercises to double your reading speed without sacrificing comprehension.',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FaBrain,
      title: 'Comprehension Focus',
      description: 'Balance speed with understanding. Our exercises ensure you retain what you read.',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: FaChartLine,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics and personalized insights.',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-transparent dark:bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-0 dark:opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-transparent dark:bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-0 dark:opacity-20 animate-pulse" />
        
        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Link to="/general-exercise">
              <Badge 
                size="2" 
                className="cursor-pointer hover:scale-105 transition-transform px-4 py-2"
                color="blue"
                variant="soft"
              >
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  New: AI-Powered Reading Exercises
                  <IoArrowForward />
                </span>
              </Badge>
            </Link>
          </div>

          {/* Main Heading */}
          <div className="text-center max-w-4xl mx-auto">
            <Heading size="9" className="mb-4 leading-tight">
              Read <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">2x Faster</span>
              <br />
              <span className="text-gray-600 dark:text-gray-300">Understand Better</span>
            </Heading>
            
            <Text size="5" className="text-gray-600 dark:text-gray-400 block mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your reading skills with scientifically-proven techniques. 
              Join thousands who've doubled their reading speed while improving comprehension.
            </Text>

            {/* CTA Buttons */}
            <Flex gap="4" justify="center" wrap="wrap" className="mb-12">
              <Link to="/general-exercise">
                <Button size="4" color="blue" className="cursor-pointer group">
                  <IoPlayCircleOutline className="text-xl" />
                  Start Free Training
                  <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="4" variant="outline" className="cursor-pointer">
                  Explore Features
                </Button>
              </Link>
            </Flex>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="p-4 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600 shadow-sm">
                  <stat.icon className="mx-auto text-2xl text-blue-600 mb-2" />
                  <Text className="text-2xl font-bold text-gray-800 dark:text-white block">{stat.value}</Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</Text>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge color="purple" size="2" className="mb-4">Features</Badge>
          <Heading size="7" className="mb-3">
            Everything You Need to Read Faster
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our platform combines proven reading techniques with modern technology 
            to help you achieve your reading goals.
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-xl transition-all duration-300 group border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-2xl text-white" />
              </div>
              <Heading size="4" className="mb-2">{feature.title}</Heading>
              <Text className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </Text>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-16 border-y border-blue-100 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge color="green" size="2" className="mb-4">How It Works</Badge>
            <Heading size="7" className="mb-3">
              Start Improving in 3 Simple Steps
            </Heading>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Choose Your Level', desc: 'Select from beginner to expert difficulty levels' },
              { step: '2', title: 'Practice Daily', desc: 'Complete engaging exercises tailored to your skill' },
              { step: '3', title: 'Track & Improve', desc: 'Monitor progress and celebrate your achievements' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <Heading size="4" className="mb-2">{item.title}</Heading>
                <Text className="text-gray-600 dark:text-gray-400">{item.desc}</Text>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/general-exercise">
              <Button size="3" color="blue" className="cursor-pointer">
                <FaRocket className="mr-2" /> Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
