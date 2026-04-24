import React, { useState } from 'react';
import { TextField, Box, Table, Heading, Text, Badge, Card, Avatar, Flex, Button } from '@radix-ui/themes';
import { MagnifyingGlassIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { IoTrophyOutline, IoMedalOutline, IoSpeedometerOutline } from 'react-icons/io5';
import { FaCrown, FaMedal, FaAward } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getLoggedIn } from '../services/authService';

function Tables() {
  const loggedIn = getLoggedIn();
  const [searchValue, setSearchValue] = useState("");
  
  const data = [
    { rank: 1, name: 'Mohd Maaz', speed: 250, avatar: 'MM' },
    { rank: 2, name: 'Syed Kumail Rizvi', speed: 248, avatar: 'SK' },
    { rank: 3, name: 'Sahil Ali', speed: 238, avatar: 'SA' },
    { rank: 4, name: 'Lucky Ali', speed: 235, avatar: 'LA' },
    { rank: 5, name: 'Ayesha Siddiqua', speed: 230, avatar: 'AS' },
    { rank: 6, name: 'Sana Fatima', speed: 225, avatar: 'SF' },
    { rank: 7, name: 'Zeba Shaikh', speed: 220, avatar: 'ZS' },
    { rank: 8, name: 'Mohd Owais', speed: 215, avatar: 'MO' },
    { rank: 9, name: 'Mohd Zaid', speed: 210, avatar: 'MZ' },
    { rank: 10, name: 'Mohd Abdullah', speed: 205, avatar: 'MA' },
  ];
  
  const [filterData, setFilterData] = useState(data);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    const newData = data.filter((item) => 
      Object.values(item).join("").toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterData(newData);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="text-yellow-500 text-xl" />;
    if (rank === 2) return <FaMedal className="text-gray-400 text-lg" />;
    if (rank === 3) return <FaAward className="text-amber-600 text-lg" />;
    return <span className="text-gray-500 font-semibold">#{rank}</span>;
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-900/30 dark:to-amber-900/30 dark:border-yellow-700/50';
    if (rank === 2) return 'from-slate-50 to-gray-100 border-slate-200 dark:from-slate-800/50 dark:to-gray-800/50 dark:border-slate-600/50';
    if (rank === 3) return 'from-orange-50 to-amber-50 border-orange-200 dark:from-orange-900/30 dark:to-amber-900/30 dark:border-orange-700/50';
    return '';
  };

  const handleViewAll = () => {
    if (!loggedIn) {
      toast.error("Please login to view full leaderboard!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Badge color="orange" size="2" className="mb-4">Leaderboard</Badge>
        <Heading size="7" className="mb-3">
          <IoTrophyOutline className="inline mr-2 text-yellow-500" />
          Top Speed Readers
        </Heading>
        <Text className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          See how you stack up against the fastest readers in our community. 
          Practice daily to climb the ranks!
        </Text>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Side - Top 3 Podium */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Heading size="4" className="flex items-center gap-2">
              <IoMedalOutline className="text-yellow-500" />
              Hall of Fame
            </Heading>
            {loggedIn ? (
              <Link to="/leaderboard">
                <Button variant="ghost" size="2" className="cursor-pointer">
                  View All <ArrowRightIcon />
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="2" className="cursor-pointer" onClick={handleViewAll}>
                View All <ArrowRightIcon />
              </Button>
            )}
          </div>

          {/* Top 3 Cards */}
          <div className="space-y-3">
            {data.slice(0, 3).map((item) => (
              <Card 
                key={item.rank} 
                className={`p-4 bg-gradient-to-r ${getRankBg(item.rank)} border hover:shadow-lg transition-all`}
              >
                <Flex gap="4" align="center" justify="between">
                  <Flex gap="3" align="center">
                    <div className="w-10 text-center">
                      {getRankIcon(item.rank)}
                    </div>
                    <Avatar
                      size="3"
                      radius="full"
                      fallback={item.avatar}
                      color={item.rank === 1 ? 'yellow' : item.rank === 2 ? 'gray' : 'orange'}
                    />
                    <div>
                      <Text className="font-semibold block text-gray-900 dark:text-gray-100">{item.name}</Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        <IoSpeedometerOutline className="inline mr-1" />
                        {item.speed} WPM
                      </Text>
                    </div>
                  </Flex>
                  <Badge color={item.rank === 1 ? 'yellow' : item.rank === 2 ? 'gray' : 'orange'} size="2">
                    {item.speed} w/m
                  </Badge>
                </Flex>
              </Card>
            ))}
          </div>

          {/* Your Stats Card */}
          <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800/50">
            <Flex align="center" justify="between">
              <div>
                <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">Ready to compete?</Text>
                <Text className="text-gray-600 dark:text-gray-300 text-sm">Start practicing to get on the leaderboard!</Text>
              </div>
              <Link to="/general-exercise">
                <Button size="2" color="blue" className="cursor-pointer">
                  Start Now
                </Button>
              </Link>
            </Flex>
          </Card>
        </div>

        {/* Right Side - Full Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Heading size="4">Rankings</Heading>
            <Box maxWidth="200px">
              <TextField.Root 
                placeholder="Search..." 
                size="2" 
                onChange={handleSearch} 
                value={searchValue}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
          </div>

          <Card className="overflow-hidden">
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="w-16">Rank</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Reader</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-right">Speed</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filterData.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={3} className="text-center py-8 text-gray-500">
                      No results found
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filterData.map((item) => (
                    <Table.Row key={item.rank} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Table.Cell>
                        <div className="flex items-center justify-center">
                          {getRankIcon(item.rank)}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex align="center" gap="2">
                          <Avatar size="1" radius="full" fallback={item.avatar} />
                          <Text className="font-medium">{item.name}</Text>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <Badge color="blue" variant="soft">{item.speed} WPM</Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Tables;
