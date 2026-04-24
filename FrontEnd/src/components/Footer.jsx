import React from 'react';
import { Box, Container, Heading, Text, Separator, Flex, Badge, Avatar } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { IoSpeedometerOutline, IoLogoGithub, IoMail, IoLocationOutline } from 'react-icons/io5';
import { FaHeart, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const contributors = [
    { name: 'Abhinav', role: 'Lead Developer' },
    { name: 'MVS Karthik', role: 'Developer' },
    { name: 'Hemanth', role: 'Developer' },
    { name: 'Chaitanya', role: 'Developer' },
  ];

  const footerLinks = {
    product: [
      { label: 'Exercises', to: '/general-exercise' },
      { label: 'Leaderboard', to: '/leaderboard' },
      { label: 'Community', to: '/community' },
      { label: 'AI Generator', to: '/generative-exercise' },
    ],
    resources: [
      { label: 'Instructions', to: '/instruction' },
      { label: 'Explore', to: '/explore' },
      { label: 'Contact Us', to: '/contact' },
    ],
  };

  return (
    <Box as="footer" className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Container size="4" py="9">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <IoSpeedometerOutline className="text-white text-xl" />
              </div>
              <div>
                <Heading size="4" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  ReadSpeed
                </Heading>
              </div>
            </Link>
            <Text className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 block">
              Transform your reading ability with scientifically-proven techniques. 
              Read faster, understand better, achieve more.
            </Text>
            <Badge color="blue" variant="soft" size="1">
              ✨ Free to use
            </Badge>
          </div>

          {/* Product Links */}
          <div>
            <Heading size="3" className="mb-4 text-gray-800 dark:text-gray-200">Product</Heading>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <Heading size="3" className="mb-4 text-gray-800 dark:text-gray-200">Resources</Heading>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Contributors */}
          <div>
            <Heading size="3" className="mb-4 text-gray-800 dark:text-gray-200">Contact</Heading>
            <ul className="space-y-3 mb-4">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <IoLocationOutline className="text-blue-500" />
                Hyderabad, India
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <FaGithub className="text-gray-700 dark:text-gray-300" />
                <a href="https://github.com/abhinav1219" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                  github.com/abhinav1219
                </a>
              </li>
            </ul>
            
            <Heading size="2" className="mb-2 text-gray-700 dark:text-gray-300">Contributors</Heading>
            <Flex gap="2" wrap="wrap">
              {contributors.map((c) => (
                <Badge key={c.name} variant="soft" color="gray" size="1">
                  {c.name}
                </Badge>
              ))}
            </Flex>
          </div>
        </div>

        <Separator size="4" className="mb-6" />

        {/* Bottom Bar */}
        <Flex justify="between" align="center" wrap="wrap" gap="4">
          <Text className="text-gray-500 dark:text-gray-500 text-sm">
            © {currentYear} ReadSpeed. All rights reserved.
          </Text>
          <Text className="text-gray-500 dark:text-gray-500 text-sm flex items-center gap-1">
            Made with <FaHeart className="text-red-400 text-xs" /> by Abhinav & Team
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
