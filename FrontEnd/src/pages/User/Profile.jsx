import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Callout,
  Card,
  Dialog,
  Flex,
  Grid,
  Heading,
  IconButton,
  Link as RxLink,
  Popover,
  SegmentedControl,
  Switch,
  Text,
  TextField,
} from '@radix-ui/themes';
import {
  InfoCircledIcon,
  Link1Icon,
  Share2Icon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { FiEdit } from 'react-icons/fi';
import { FaLock, FaReadme, FaLevelUpAlt, FaTrophy } from 'react-icons/fa';
import { RiAwardLine, RiSpeedUpLine } from 'react-icons/ri';
import { IoHomeOutline, IoSpeedometer } from 'react-icons/io5';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '../../components/Breadcrumb';
import UserProgressChart from './UserProgressChart.jsx';
import api from '../../services/axiosConfig.js';
import { getLoggedIn, getUserData } from '../../services/authService';
// import { getUser } from '../../Utils/helper';

const LEVEL_RANK = { Easy: 1, Medium: 2, Hard: 3 };
const RANK_LEVEL = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
const LEVEL_COLOR = { Easy: 'green', Medium: 'amber', Hard: 'red' };

function Profile() {
  const loggedIn = getLoggedIn();
  const { user } = getUserData() || {};
  const userEmail = user?.userEmail;
  const userName = user?.userName || 'User';

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');
  const [otpStatus, setOtpStatus] = useState('Sending OTP...');
  const [otp, setOtp] = useState('');
  const [twoFA, setTwoFA] = useState(false);

  const fetchUserDetails = async ({ silent = false } = {}) => {
    if (!userEmail) return;
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await api.post('/user/getAllDetails', { email: userEmail });
      setUserDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch user details', err);
      if (!silent) toast.error('Could not load profile data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (loggedIn && userEmail) fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, userEmail]);

  const results = userDetails?.result || [];

  const filteredResults = useMemo(() => {
    if (filterLevel === 'all') return results;
    return results.filter((r) => r?.exercise?.difficulty?.level === filterLevel);
  }, [results, filterLevel]);

  const stats = useMemo(() => {
    const valid = results.filter((r) => typeof r.wpm === 'number');
    const totalScore = results.reduce((acc, r) => acc + (r.score || 0), 0);
    const avgSpeed = valid.length
      ? (valid.reduce((a, c) => a + c.wpm, 0) / valid.length).toFixed(1)
      : 0;
    const highestSpeed = valid.length ? Math.max(...valid.map((r) => r.wpm)) : 0;
    const levelRanks = results
      .map((r) => LEVEL_RANK[r?.exercise?.difficulty?.level])
      .filter(Boolean);
    const avgLevel = levelRanks.length
      ? RANK_LEVEL[Math.round(levelRanks.reduce((a, b) => a + b, 0) / levelRanks.length)]
      : '—';
    const completed = results.filter((r) => (r.score || 0) > 0).length;
    return {
      totalScore,
      totalExercises: results.length,
      avgSpeed,
      highestSpeed,
      avgLevel,
      completed,
      completionPct: results.length ? Math.round((completed / results.length) * 100) : 0,
    };
  }, [results]);

  if (!loggedIn) return <Navigate to="/login" />;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Profile', href: '/profile' },
  ];

  const handleSendOtp = async () => {
    setOtpStatus('Sending OTP...');
    try {
      const res = await api.post('/email/generateEmail', { email: userEmail });
      if (res.data) {
        toast.success('OTP sent to your email');
        setOtpStatus('OTP sent successfully. Check your inbox.');
      } else {
        toast.error('Failed to send OTP');
        setOtpStatus('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to send OTP');
      setOtpStatus('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error('Please enter the OTP');
    try {
      const res = await api.post('/email/verifyEmail', { email: userEmail, otp });
      if (res.data) {
        toast.success('Email verified successfully!');
        fetchUserDetails({ silent: true });
      } else {
        toast.error('Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error('Verification failed');
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied!');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const isVerified = userDetails?.isEmailVerified;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={breadcrumbs} icon={IoHomeOutline} />

        {/* HERO HEADER */}
        <Card className="mt-4 p-6 sm:p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-indigo-100 dark:border-gray-700">
          <Flex direction={{ initial: 'column', sm: 'row' }} gap="6" align="center">
            <div className="relative">
              <Avatar
                size="8"
                fallback={userName[0]?.toUpperCase() || 'U'}
                radius="full"
                color="indigo"
                className="ring-4 ring-white dark:ring-gray-800 shadow-lg"
              />
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1.5 shadow-md ring-2 ring-white dark:ring-gray-800">
                  <CheckCircledIcon width="16" height="16" />
                </div>
              )}
            </div>

            <Flex direction="column" gap="2" className="flex-1 text-center sm:text-left">
              <Flex gap="2" align="center" justify={{ initial: 'center', sm: 'start' }} wrap="wrap">
                <Heading size="7" className="text-gray-900 dark:text-gray-100">
                  {userName}
                </Heading>
                {isVerified ? (
                  <Badge color="jade" variant="soft" radius="full">
                    <CheckCircledIcon /> Verified
                  </Badge>
                ) : (
                  <Badge color="amber" variant="soft" radius="full">
                    <ExclamationTriangleIcon /> Unverified
                  </Badge>
                )}
              </Flex>
              <Text className="text-gray-600 dark:text-gray-400">
                <RxLink href={`mailto:${userEmail}`}>{userEmail}</RxLink>
              </Text>
              <Flex gap="2" wrap="wrap" justify={{ initial: 'center', sm: 'start' }} className="mt-2">
                <Badge variant="soft" color="indigo">
                  <FaTrophy /> {stats.totalScore} pts
                </Badge>
                <Badge variant="soft" color="blue">
                  <IoSpeedometer /> {stats.avgSpeed} avg WPM
                </Badge>
                <Badge variant="soft" color="gray">
                  {stats.totalExercises} sessions
                </Badge>
              </Flex>
            </Flex>

            <Flex gap="2" wrap="wrap" justify="center">
              <EditProfileDialog userName={userName} userEmail={userEmail} onSaved={() => fetchUserDetails({ silent: true })} />
              <Popover.Root>
                <Popover.Trigger>
                  <Button variant="soft" className="cursor-pointer">
                    <Share2Icon /> Share
                  </Button>
                </Popover.Trigger>
                <Popover.Content width="280px">
                  <Flex direction="column" gap="2">
                    <Heading size="2">Share your profile</Heading>
                    <Text size="2" color="gray">
                      Copy a link to share your reading progress.
                    </Text>
                    <Button size="2" onClick={handleCopyShareLink} className="cursor-pointer">
                      <Link1Icon /> Copy link
                    </Button>
                  </Flex>
                </Popover.Content>
              </Popover.Root>
              <IconButton
                variant="soft"
                color="gray"
                onClick={() => fetchUserDetails({ silent: true })}
                disabled={refreshing}
                className="cursor-pointer"
                aria-label="Refresh"
              >
                <ReloadIcon className={refreshing ? 'animate-spin' : ''} />
              </IconButton>
            </Flex>
          </Flex>

          {!isVerified && userDetails && (
            <Callout.Root color="amber" className="mt-5">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>
                <Flex gap="3" align="center" justify="between" wrap="wrap">
                  <span>Your email is not verified. Verify to unlock all features.</span>
                  <VerifyEmailDialog
                    onSendOtp={handleSendOtp}
                    onVerify={handleVerifyOtp}
                    otpStatus={otpStatus}
                    setOtp={setOtp}
                  />
                </Flex>
              </Callout.Text>
            </Callout.Root>
          )}
        </Card>

        {/* DETAILS + STATS */}
        <Grid columns={{ initial: '1', md: '3' }} gap="4" className="mt-6">
          <Card className="p-5 md:col-span-1">
            <Heading size="3" className="mb-4 text-gray-900 dark:text-gray-100">
              Account Details
            </Heading>
            <Flex direction="column" gap="3">
              <DetailRow label="Name" value={userName} />
              <DetailRow
                label="Email"
                value={
                  <RxLink href={`mailto:${userEmail}`} className="break-all">
                    {userEmail}
                  </RxLink>
                }
              />
              <DetailRow
                label="2FA"
                value={
                  <Flex align="center" gap="2">
                    <FaLock className="text-gray-500 dark:text-gray-400" />
                    <Badge color={twoFA ? 'jade' : 'gray'} variant="soft" radius="full">
                      {twoFA ? 'on' : 'off'}
                    </Badge>
                    <Switch
                      checked={twoFA}
                      onCheckedChange={(v) => {
                        setTwoFA(v);
                        toast.success(`2FA turned ${v ? 'on' : 'off'}`);
                      }}
                    />
                  </Flex>
                }
              />
              <DetailRow label="Age" value={user?.age || userDetails?.age || 'Not set'} />
              <DetailRow label="Location" value={user?.city || userDetails?.city || 'Not set'} />
            </Flex>
          </Card>

          <div className="md:col-span-2">
            <Grid columns={{ initial: '2', sm: '3', lg: '5' }} gap="3">
              <StatCard
                icon={<RiAwardLine />}
                label="Total Score"
                value={stats.totalScore}
                suffix="pts"
                color="from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20"
                iconColor="text-amber-600 dark:text-amber-400"
                loading={loading}
              />
              <StatCard
                icon={<FaReadme />}
                label="Total Sessions"
                value={stats.totalExercises}
                color="from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20"
                iconColor="text-blue-600 dark:text-blue-400"
                loading={loading}
              />
              <StatCard
                icon={<IoSpeedometer />}
                label="Avg Speed"
                value={stats.avgSpeed}
                suffix="WPM"
                color="from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20"
                iconColor="text-emerald-600 dark:text-emerald-400"
                loading={loading}
              />
              <StatCard
                icon={<RiSpeedUpLine />}
                label="Top Speed"
                value={stats.highestSpeed}
                suffix="WPM"
                color="from-purple-50 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/20"
                iconColor="text-purple-600 dark:text-purple-400"
                loading={loading}
              />
              <StatCard
                icon={<FaLevelUpAlt />}
                label="Avg Level"
                value={stats.avgLevel}
                color="from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/20"
                iconColor="text-rose-600 dark:text-rose-400"
                loading={loading}
              />
            </Grid>

            <Card className="mt-3 p-4">
              <Flex justify="between" align="center" gap="3" wrap="wrap">
                <div>
                  <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">
                    Completion Rate
                  </Text>
                  <Text size="1" className="text-gray-500 dark:text-gray-400 block">
                    {stats.completed} of {stats.totalExercises} sessions completed successfully
                  </Text>
                </div>
                <Text size="5" weight="bold" className="text-indigo-600 dark:text-indigo-400">
                  {stats.completionPct}%
                </Text>
              </Flex>
              <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${stats.completionPct}%` }}
                />
              </div>
            </Card>
          </div>
        </Grid>

        {/* PROGRESS CHART */}
        <Card className="mt-6 p-5">
          <Flex justify="between" align="center" wrap="wrap" gap="3" className="mb-4">
            <div>
              <Heading size="4" className="text-gray-900 dark:text-gray-100">
                Progress Chart
              </Heading>
              <Text size="2" className="text-gray-500 dark:text-gray-400">
                Your reading speed and scores over time
              </Text>
            </div>
            <Badge variant="soft" color="gray">
              {results.length} data points
            </Badge>
          </Flex>
          {loading ? (
            <SkeletonBlock height="320px" />
          ) : results.length === 0 ? (
            <EmptyState title="No progress yet" message="Complete an exercise to see your progress chart here." />
          ) : (
            <UserProgressChart userDetails={userDetails} />
          )}
        </Card>

        {/* READING LIST */}
        <Card className="mt-6 p-5">
          <Flex justify="between" align="center" wrap="wrap" gap="3" className="mb-4">
            <div>
              <Heading size="4" className="text-gray-900 dark:text-gray-100">
                Exercise History
              </Heading>
              <Text size="2" className="text-gray-500 dark:text-gray-400">
                All your reading sessions
              </Text>
            </div>
            <SegmentedControl.Root value={filterLevel} onValueChange={setFilterLevel}>
              <SegmentedControl.Item value="all">All</SegmentedControl.Item>
              <SegmentedControl.Item value="Easy">Easy</SegmentedControl.Item>
              <SegmentedControl.Item value="Medium">Medium</SegmentedControl.Item>
              <SegmentedControl.Item value="Hard">Hard</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Flex>

          {loading ? (
            <Flex direction="column" gap="3">
              <SkeletonBlock height="80px" />
              <SkeletonBlock height="80px" />
              <SkeletonBlock height="80px" />
            </Flex>
          ) : filteredResults.length === 0 ? (
            <EmptyState
              title="No sessions found"
              message={
                filterLevel === 'all'
                  ? 'Start your first exercise to see it here.'
                  : `No ${filterLevel} level sessions yet.`
              }
            />
          ) : (
            <Flex direction="column" gap="3">
              {filteredResults.map((item, idx) => (
                <SessionCard key={item._id || idx} item={item} />
              ))}
            </Flex>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------- subcomponents ---------- */

function DetailRow({ label, value }) {
  return (
    <Flex justify="between" align="center" gap="3">
      <Text size="2" className="text-gray-500 dark:text-gray-400 min-w-[80px]">
        {label}
      </Text>
      <div className="text-right text-gray-900 dark:text-gray-100">
        {typeof value === 'string' ? <Text size="2">{value}</Text> : value}
      </div>
    </Flex>
  );
}

function StatCard({ icon, label, value, suffix, color, iconColor, loading }) {
  return (
    <Card className={`p-4 bg-gradient-to-br ${color} border border-transparent dark:border-gray-700/50 transition-transform hover:scale-[1.02]`}>
      <Flex direction="column" gap="2">
        <div className={`text-2xl ${iconColor}`}>{icon}</div>
        <Text size="1" weight="bold" className="text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          {label}
        </Text>
        {loading ? (
          <SkeletonBlock height="28px" />
        ) : (
          <Flex align="baseline" gap="1">
            <Text size="6" weight="bold" className="text-gray-900 dark:text-gray-100">
              {value}
            </Text>
            {suffix && (
              <Text size="2" className="text-gray-500 dark:text-gray-400">
                {suffix}
              </Text>
            )}
          </Flex>
        )}
      </Flex>
    </Card>
  );
}

function SessionCard({ item }) {
  const level = item?.exercise?.difficulty?.level;
  const levelColor = LEVEL_COLOR[level] || 'gray';
  const completed = (item.score || 0) > 0;
  const date = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all bg-white dark:bg-gray-800/50">
      <Flex justify="between" align="start" gap="3" wrap="wrap">
        <div className="flex-1 min-w-[200px]">
          <Flex align="center" gap="2" wrap="wrap">
            <Heading size="3" className="text-gray-900 dark:text-gray-100">
              {item?.exercise?.name || 'Exercise'}
            </Heading>
            {level && (
              <Badge color={levelColor} variant="soft" radius="full">
                {level}
              </Badge>
            )}
            {completed ? (
              <Badge color="jade" variant="soft" radius="full">
                Completed
              </Badge>
            ) : (
              <Badge color="gray" variant="soft" radius="full">
                Incomplete
              </Badge>
            )}
          </Flex>
          {item?.exercise?.description && (
            <Text size="2" className="text-gray-600 dark:text-gray-400 mt-1 block">
              {item.exercise.description}
            </Text>
          )}
          {date && (
            <Text size="1" className="text-gray-400 dark:text-gray-500 mt-1 block">
              {date}
            </Text>
          )}
        </div>
        <Flex gap="4" align="center" className="shrink-0">
          <MiniStat label="WPM" value={item.wpm ?? '—'} accent="text-blue-600 dark:text-blue-400" />
          <MiniStat label="Score" value={item.score ?? 0} accent="text-emerald-600 dark:text-emerald-400" />
        </Flex>
      </Flex>
    </div>
  );
}

function MiniStat({ label, value, accent }) {
  return (
    <div className="text-center">
      <Text size="4" weight="bold" className={accent}>
        {value}
      </Text>
      <Text size="1" className="text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
        {label}
      </Text>
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="text-center py-10">
      <div className="text-4xl mb-2">📭</div>
      <Text size="3" weight="bold" className="text-gray-700 dark:text-gray-300 block">
        {title}
      </Text>
      <Text size="2" className="text-gray-500 dark:text-gray-400">
        {message}
      </Text>
    </div>
  );
}

function SkeletonBlock({ height = '20px' }) {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" style={{ height }} />
  );
}

function EditProfileDialog({ userName, userEmail, onSaved }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: userName, age: '', city: '' });

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/user/update', { email: userEmail, ...form });
      toast.success('Profile updated');
      onSaved?.();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="indigo" variant="soft" className="cursor-pointer">
          <FiEdit /> Edit
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          Update your personal information.
        </Dialog.Description>
        <Flex direction="column" gap="3">
          <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Your full name" />
          <Field label="Email" value={userEmail} disabled />
          <Field label="Age" value={form.age} onChange={(v) => setForm((f) => ({ ...f, age: v }))} placeholder="Your age" type="number" />
          <Field label="Location" value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} placeholder="City, Country" />
        </Flex>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" className="cursor-pointer">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function Field({ label, value, onChange, placeholder, disabled, type = 'text' }) {
  return (
    <label>
      <Text as="div" size="2" mb="1" weight="bold" className="text-gray-700 dark:text-gray-300">
        {label}
      </Text>
      <TextField.Root
        value={value || ''}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </label>
  );
}

function VerifyEmailDialog({ onSendOtp, onVerify, otpStatus, setOtp }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger onClick={onSendOtp}>
        <Button size="1" color="amber" variant="solid" className="cursor-pointer">
          Verify Now
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="420px">
        <Dialog.Title>Verify your email</Dialog.Title>
        <Dialog.Description size="2" mb="3" color="gray">
          We sent a one-time password to your email.
        </Dialog.Description>
        <Callout.Root className="mb-3">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{otpStatus}</Callout.Text>
        </Callout.Root>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Enter OTP
          </Text>
          <TextField.Root placeholder="6-digit code" onChange={(e) => setOtp(e.target.value)} />
        </label>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" className="cursor-pointer">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={onVerify} className="cursor-pointer">
              Verify
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default Profile;
