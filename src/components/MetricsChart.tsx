import React from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Target, Activity } from 'lucide-react';

interface MetricData {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  category: 'revenue' | 'growth' | 'engagement' | 'financial';
  description?: string;
  chartData?: number[];
}

interface MetricsChartProps {
  metrics: MetricData[];
  className?: string;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ metrics, className = '' }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue':
        return <DollarSign size={20} className="text-[#B74B28]" />;
      case 'growth':
        return <TrendingUp size={20} className="text-[#B74B28]" />;
      case 'engagement':
        return <Users size={20} className="text-[#B74B28]" />;
      case 'financial':
        return <Target size={20} className="text-[#B74B28]" />;
      default:
        return <Activity size={20} className="text-[#B74B28]" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue':
        return 'bg-[#7583FA]';
      case 'growth':
        return 'bg-[#FAB049]';
      case 'engagement':
        return 'bg-[#9C6220]';
      case 'financial':
        return 'bg-[#B74B28]';
      default:
        return 'bg-[#7583FA]';
    }
  };

  // Simple sparkline component
  const Sparkline: React.FC<{ data: number[]; trend: string }> = ({ data, trend }) => {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#6b7280';

    return (
      <div className="w-full h-12 mt-2">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            points={points}
          />
          <defs>
            <linearGradient id={`gradient-${trend}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <polygon
            fill={`url(#gradient-${trend})`}
            points={`0,100 ${points} 100,100`}
          />
        </svg>
      </div>
    );
  };

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${getCategoryColor(metric.category)} rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 text-white transform ${
            index % 2 === 0 ? 'rotate-1' : '-rotate-1'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white rounded-full border-2 border-black flex items-center justify-center">
              {getCategoryIcon(metric.category)}
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border-2 border-white ${getTrendColor(metric.trend)}`}>
              {getTrendIcon(metric.trend)}
              <span className="text-xs font-bold">{metric.change}</span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold mb-2">{metric.label}</h3>
          <p className="text-3xl font-black mb-2">{metric.value}</p>
          
          {metric.description && (
            <p className="text-sm opacity-90 mb-2">{metric.description}</p>
          )}
          
          {metric.chartData && (
            <Sparkline data={metric.chartData} trend={metric.trend} />
          )}
        </div>
      ))}
    </div>
  );
};