import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const useIsDark = () => {
  const [isDark, setIsDark] = useState(
    typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
};

const UserProgressChart = ({ userDetails }) => {
  const isDark = useIsDark();
  const results = userDetails?.result || [];

  const { chartData, completed, incomplete } = useMemo(() => {
    const data = results.map((r, i) => ({
      name: `S${i + 1}`,
      label:
        r.exercise?.name?.slice(0, 18) || `Session ${i + 1}`,
      wpm: r.wpm || 0,
      score: r.score || 0,
    }));
    const completed = results.filter((r) => (r.score || 0) > 0).length;
    return {
      chartData: data,
      completed,
      incomplete: results.length - completed,
    };
  }, [results]);

  const pieData = [
    { name: 'Completed', value: completed },
    { name: 'Incomplete', value: incomplete },
  ];

  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipText = isDark ? '#f3f4f6' : '#111827';
  const PIE_COLORS = ['#10b981', isDark ? '#4b5563' : '#d1d5db'];

  const tooltipStyle = {
    backgroundColor: tooltipBg,
    border: `1px solid ${tooltipBorder}`,
    borderRadius: '8px',
    color: tooltipText,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Line chart - WPM & Score over time */}
      <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Performance over time
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
            <YAxis stroke={axisColor} fontSize={12} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: tooltipText, fontWeight: 600 }}
              formatter={(value, key, ctx) => [value, key === 'wpm' ? 'WPM' : 'Score']}
              labelFormatter={(label, payload) =>
                payload?.[0]?.payload?.label || label
              }
            />
            <Legend wrapperStyle={{ color: axisColor, fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="wpm"
              name="WPM"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="score"
              name="Score"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Donut - completion */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 self-start">
          Completion breakdown
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
            >
              {pieData.map((_, idx) => (
                <Cell key={idx} fill={PIE_COLORS[idx]} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: tooltipText }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex gap-4 text-sm mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-700 dark:text-gray-300">
              Completed ({completed})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: PIE_COLORS[1] }}
            />
            <span className="text-gray-700 dark:text-gray-300">
              Incomplete ({incomplete})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgressChart;

